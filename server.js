var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];
trump_health=500;
clinton_health=500;

server.listen(3000);
console.log("Server running...");

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('player', function(data){
    var player=data;
  });

  socket.on('up', function(data){
    io.sockets.emit('move-up', data);
  });
  socket.on('down', function(data){
    io.sockets.emit('move-down', data);
  });
  socket.on('shot', function(data){
    if(data[0] > data[1] && data[0] < (data[1]+100)){
      if(data[2]=="trump"){
        trump_health=trump_health-100;
        io.sockets.emit('hit', data[2]);
      }else{
        clinton_health=clinton_health-100;
        io.sockets.emit('hit', data[2]);
      }
    }
  });

  //Disconect
  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });
});
