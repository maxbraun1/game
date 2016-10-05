var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(80);
console.log("Server running...");

app.use(express.static(__dirname + '/public'));

/* io starts */

io.sockets.on('connection', function(socket){
  connections.push(socket);
  socket.emit('count',connections.length);
  var d = new Date();
  console.log(connections.length+' connections');

  //Creating and joining rooms
  socket.on('new-room', function(room, player, username){
    socket.join(room);
    socket.room = room;
    socket.player = player;
    socket.username = username;
    socket.health = 500;
    socket.powerup = true;
    console.log("["+username+"] created room "+room+" as player "+player);
  });
  socket.on('join-room', function(room,username){
    io.to(room).emit('player-joined');
    socket.join(room);
    socket.room = room;
    socket.username = username;
    socket.health = 500;
    socket.powerup = true;
  });
  socket.on('current-player',function(player){
    io.to(socket.room).emit('existing-player',player);
  });
  socket.on('new-player-info',function(player,username,room){
    socket.player=player;
    io.to(socket.room).emit('new-info', player,username,room);
  });
  socket.on('ready',function(){
    io.to(socket.room).emit('game_ready');
    console.log("Game ready on room "+socket.room);
  });

  // Movements
  socket.on('up', function(data){
    io.to(socket.room).emit('move-up', data);
  });
  socket.on('down', function(data){
    io.to(socket.room).emit('move-down', data);
  });

  // Shooting
  socket.on('player-shoots', function(player){
    if(player=="trump"){
      io.to(socket.room).emit('trump-shoot');
    }
    else if(player=="clinton"){
      io.to(socket.room).emit('clinton-shoot');
    }
  });
  socket.on('shot', function(bullet_pos,sprite_pos,shooter){
    if(bullet_pos > sprite_pos && bullet_pos < (sprite_pos+100)){
      if(shooter=="trump"){
        io.to(socket.room).emit('clinton-hit');
      }else if(shooter=="clinton"){
        io.to(socket.room).emit('trump-hit');
      }
    }
  });
  socket.on('health',function(player){
    socket.health -= 100;
    io.to(socket.room).emit('update-health',player,socket.health);
    if(socket.health==0){
      io.to(socket.room).emit('loser',socket.player);
    }
  });
  socket.on('getPlayer',function(){
    io.to(socket.id).emit('player',socket.player);
  });

  // Powerups
  socket.on('powerup-trump',function(){
    if(socket.powerup==true){
      io.to(socket.room).emit('wall');
      socket.powerup = false;
    }
  });
  socket.on('powerup-clinton',function(){
    if(socket.powerup==true){
      io.to(socket.room).emit('email');
      socket.powerup = false;
    }
  });

  //message
  socket.on('message',function(message){
    socket.emit('new-message',message);
  });

  //Disconect
  socket.on('disconnect', function(data){
    io.to(socket.room).emit('player-left', socket.username);
    socket.leave(socket.room);
    socket.emit('count',connections.length);
    console.log("["+socket.username+"] disconnected from room "+socket.room);
    connections.splice(connections.indexOf(socket), 1);
    console.log(connections.length+" connections");
  });
});
