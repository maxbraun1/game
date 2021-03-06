var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];
rooms = [];

server.listen(3000);
console.log("Server running...");

app.use(express.static(__dirname + '/public'));

/* io starts */

io.sockets.on('connection', function(socket){
  connections.push(socket);
  io.sockets.emit('count',connections.length);
  var d = new Date();
  console.log(connections.length+' connections');

  //Creating and joining rooms
  socket.on('new-room', function(room,player,username){
    rooms.push(room);
    socket.join(room);
    socket.room = room;
    socket.player = player;
    socket.username = username;
    socket.health = 500;
    socket.powerup = true;
    console.log("["+username+"] created room "+room+" as player "+player);
  });
  socket.on('join-room', function(room,player,username){
    socket.room = room;
    socket.player = player;
    socket.username = username;
    socket.health = 500;
    socket.powerup = true;
    io.to(socket.room).emit('player-joined',room,player,username);
    console.log("["+username+"] joined room "+room+" as player "+player);
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
    }else if(player=="clinton"){
      io.to(socket.room).emit('clinton-shoot');
    }else if(player=="bill"){
      io.to(socket.room).emit('bill-shoot');
    }
  });
  socket.on('shot', function(bullet_pos,sprite_pos,opponent){
    if(bullet_pos > (sprite_pos-7) && bullet_pos < (sprite_pos+100)){
      if(opponent=="trump"){
        io.to(socket.room).emit('trump-hit');
      }else if(opponent=="clinton"){
        io.to(socket.room).emit('clinton-hit');
      }else if(opponent=="bill"){
        io.to(socket.room).emit('bill-hit');
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
  socket.on('powerup-bill',function(){
    if(socket.powerup==true){
      io.to(socket.room).emit('impeach');
      socket.powerup = false;
    }
  });

  //Check lobby
  socket.on('check_lobby',function(room){
    io.to(room).emit('player-check', socket.id);
    socket.join(room);
  });
  socket.on('existing-player',function(player,socketID){
    io.sockets.connected[socketID].emit('join',player);
  });

  socket.on('game-ready',function(){
    io.to(socket.room).emit('ready');
  });

  //Disconect
  socket.on('disconnect', function(data){
    io.to(socket.room).emit('player-left', socket.username);
    socket.leave(socket.room);
    connections.splice(connections.indexOf(socket), 1);
    io.sockets.emit('count',connections.length);
    console.log(connections.length+" connections");
  });
});
