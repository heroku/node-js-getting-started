var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var client = require('twilio')('AP5dbe6c613265389df4d44de59a952237', '3302286d4691c4db86c17dccbffb78d1')
var express = require('express');
var app = express();
var path = require('path');


var server = http.createServer(function(request, response) {
                               var filePath = false;
                               
                               if (request.url == '/') {
                               filePath = '/public/index.html';
                               } else {
                               filePath = '/public' + request.url;
                               }
                               
                               var absPath = './' + filePath;
                               serverWorking(response, absPath);
                               }).listen(3000);

function serverWorking(response, absPath) {
    fs.exists(absPath, function(exists) {
              if (exists) {
              fs.readFile(absPath, function(err, data) {
                          if (err) {
                          send404(response)
                          } else {
                          sendPage(response, absPath, data);
                          }
                          });
              } else {
              send404(response);
              }
              });
}


function send404(response) {
    response.writeHead(404, {"Content-type" : "text/plain"});
    response.write("Error 404: resource not found");
    response.end();
}
function sendPage(response, filePath, fileContents) {
    response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

