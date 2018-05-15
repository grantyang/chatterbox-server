var fs = require('fs');

var html = fs.readFileSync('./client/index.html', 'UTF-8');
var results = [['/classes/messages', []]];
var objectId = 0;

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': ' content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


exports.requestHandler = function(req, res) {
  // res.writeHeader(200, { 'Content-Type': 'text/html' });
  // res.write(html);
  // res.end();

  // fs.readFile('./client' + req.url, function(err, file) {
  //   if (err) {
  //     res.writeHead(404, {
  //       'Content-Type': 'text/plain'
  //     });
  //     console.log(`File ${req.url} not found`);
  //     res.end('File not found');
  //   } else {
  //     res.writeHead(200, {
  //       'Content-Type': 'text/plain'
  //     });
  //     console.log(`File ${req.url} loaded`);
  //     res.end(file);
  //   }
  // });

  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  var statusCode = 200;
  var responseObj = {};

  if (req.method === 'GET') {
    let roomIndex = results.findIndex(chatroom => chatroom[0] === req.url);
    if (roomIndex !== -1) {
      responseObj.results = results[roomIndex][1];
    } else {
      statusCode = 204;
    }
    res.writeHead(statusCode, headers);
    res.end(JSON.stringify(responseObj));
  } else if (req.method === 'POST') {
    let body = [];
    req
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        let roomIndex = results.findIndex(chatroom => {
          return chatroom[0] === req.url;
        });
        parsedBody = JSON.parse(body);
        parsedBody.objectId = objectId;
        if (roomIndex !== -1) {
          results[roomIndex][1].unshift(parsedBody);
        } else {
          results.unshift([req.url, [parsedBody]]);
        }
        objectId++;
        responseObj.body = body;
      });
    statusCode = 201;
    res.writeHead(statusCode, headers);
    res.end(JSON.stringify(responseObj));
  } else if (req.method === 'OPTIONS') {
    res.writeHead(statusCode, headers);
    res.end();
  }

  // headers['Content-Type'] = 'text/html';
  // res.writeHead(200, headers);
  // console.log(html)
  // res.end(html);
  // return;
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
