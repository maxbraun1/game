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

/* io starts */

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('new-room', function(room, player, username){
    socket.join(room);
    socket.room = room;
    socket.player = player;
    socket.username = username;
    console.log("User created room "+room+" as player "+player);
  });
  socket.on('join-room', function(room,username){
    socket.join(room);
    socket.room = room;
    socket.username = username;
    io.to(socket.room).emit('player-joined', room,username);
  });
  socket.on('current-player',function(player_name){
    io.to(socket.room).emit('existing-player',player_name);
  });
  socket.on('new-player-info',function(player,username,room){
    io.to(socket.room).emit('new-info', player,username,room);
  });
  socket.on('up', function(data){
    io.to(socket.room).emit('move-up', data);
  });
  socket.on('down', function(data){
    io.to(socket.room).emit('move-down', data);
  });
  socket.on('shoot', function(player){
    if(player=="trump"){
      io.to(socket.room).emit('trump-shoot');
    }
    else{
      io.to(socket.room).emit('clinton-shoot');
    }
  });
  socket.on('shot', function(data){
    if(data[0] > data[1] && data[0] < (data[1]+100)){
      if(data[2]=="trump"){
        trump_health=trump_health-100;
        io.to(socket.room).emit('hit', data[2]);
      }else{
        clinton_health=clinton_health-100;
        io.to(socket.room).emit('hit', data[2]);
      }
    }
  });

  //Disconect
  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });
});
