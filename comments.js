// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

var comments = [];

var server = http.createServer(function(request, response) {
  var parsedUrl = url.parse(request.url);
  var resource = parsedUrl.pathname;
  console.log('resource=', resource);

  if (resource == '/comments') {
    if (request.method == 'POST') {
      console.log('POST request');
      request.on('data', function(data) {
        var str = data.toString(); // 'name=soo&message=sooso'
        var parsedStr = querystring.parse(str);
        var name = parsedStr.name;
        var message = parsedStr.message;
        comments.push({name: name, message: message});
        console.log('name=', name, 'message=', message);
      });
      request.on('end', function() {
        response.writeHead(302, {'Location': '/index.html'});
        response.end();
      });
    } else if (request.method == 'GET') {
      console.log('GET request');
      var jsonData = JSON.stringify(comments);
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(jsonData);
    }
  } else {
    var filePath = '.' + resource;
    if (filePath == './') {
      filePath = './index.html';
    }
    fs.readFile(filePath, function(error, data) {
      if (error) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end('404 Not Found');
      } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
      }
    });
  }
});

server.listen(3000, function() {
  console.log('Server is running...');
});