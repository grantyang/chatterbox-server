var app = {
  server: 'http://127.0.0.1:3000/',

  init: function() {
    // Get username
    app.username = window.location.search.substr(10);
    app.onscreenMessages = {};
    // cache some dom references
    app.$text = $('#message');
    app.loadMsgs();
    setInterval(app.loadMsgs.bind(app), 1000);
    $('#send').on('submit', app.handleSubmit);
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var message = {
      username: 'grant',
      text: app.$text.val(),
    };
    app.$text.val('');
    app.sendMsg(message);
  },

  renderMessage: function(message) {
    var $user = $('<div>', { class: 'user' }).text(message.username);
    var $text = $('<div>', { class: 'text' }).text(message.text);
    var $message = $('<div>', {
      class: 'chat',
      'data-id': message.objectId
    }).append($user, $text);
    return $message;
  },

  displayMessage: function(message) {
    if (message.objectId !== undefined && !app.onscreenMessages[message.objectId]) {
      var $html = app.renderMessage(message);
      $('#chats').prepend($html);
      app.onscreenMessages[message.objectId] = true;
    }
  },

  displayMessages: function(messages) {
    for (var i = messages.length; i > 0; i--) {
      app.displayMessage(messages[i - 1]);
    }
  },

  loadMsgs: function() {
    $.ajax({
      url: app.server,
      contentType: 'application/json',
      success: function(json) {
        if (json){
          app.displayMessages(json.results);
        }
      },
      complete: function() {
        app.stopSpinner();
      }
    });
  },

  sendMsg: function(message) {
    app.startSpinner();
    $.ajax({
      type: 'POST',
      url: app.server,
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(json) {
        app.displayMessage(message);
      },
      complete: function() {
        app.stopSpinner();
      }
    });
  },

  startSpinner: function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  }
};
