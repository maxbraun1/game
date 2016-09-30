var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(3000);
console.log("Server running...");

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('message', function(message){
    console.log("New Message");
    io.sockets.emit('update', message);
  });

  socket.on('down', function(){
    console.log("down");
  });

  //Disconect
  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });
});
