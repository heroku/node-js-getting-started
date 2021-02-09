const express = require("express");
var app = require('express')();
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');
app.use(express.static(__dirname));

app.get('/', (req, res) => {  
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('yogi', (msg) => {
    console.log('message: ' + msg);
    fs.readFile('./public/node.svg', (err, buff) => {
      socket.emit('reply', buff);
    })    
  });  
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});