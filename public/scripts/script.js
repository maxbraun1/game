//$("#opener").hide();

$("#create-game-form").submit(function(e){
  e.preventDefault();
  room = $("#room-id").val();
  username = $("#create-username").val();
  $("title").html("TvC Room: "+room);
  $("#menu-room-id").html(room);
  socket.emit('new-room', room,player,username);
  $(".darken").hide();
  $("#create-game").hide();
  $("#opener").hide();
  ready=false;
  initialize(player);
});
$("#join-game-form").submit(function(e){
  e.preventDefault();
  room = $("#join-id").val();
  username = $("#join-username").val();
  $("title").html("TvC Room: "+room);
  $("#menu-room-id").html(room);
  socket.emit('join-room', room,username);
});
socket.on('player-joined',function(){
  if(init == true){ //if you are already connected
    socket.emit('current-player', player);
  }
});
socket.on('existing-player',function(player){
  if(init==false){
    $(".darken").hide();
    $("#join-game").hide();
    $("#opener").hide();
    if(player=="trump"){
      player = "clinton";
      socket.emit('new-player-info', "clinton",username,room);
      socket.emit('ready');
      initialize("clinton");
    }else if(player=="clinton"){
      player = "trump";
      socket.emit('new-player-info', "trump",username,room);
      socket.emit('ready');
      initialize("trump");
    }else{
      document.location.reload(true);
    }
  }
});
socket.on('new-info',function(player,username,room){
  new PNotify({
    title: 'A user has joined',
    text: "User "+username+" has connected to this lobby ("+room+") as "+player,
    type: 'info',
    icon: false
  });
});
socket.on('loser',function(loser){
  if(player==null){
    socket.emit('getPlayer');
  }else{
    announce(player);
  }
  socket.on('player',function(player){
    announce(player);
  });
  function announce(player){
    if(ready==true){
      ready=false;
      if(loser==player){
        if(loser=="trump"){
          $("#lose #player").html("Trump");
        }else if(loser=="clinton"){
          $("#lose #player").html("Clinton");
        }
        $(".darken").fadeIn();
        $("#lose").fadeIn();
      }
      else{
        if(loser=="trump"){
          $("#win #player").html("Clinton");
        }else if(loser=="clinton"){
          $("#win #player").html("Trump");
        }
        $(".darken").fadeIn();
        $("#win").fadeIn();
      }
    }
  }
});
$(".ok").click(function(){
  document.location.reload(true);
});
socket.on('game_ready',function(){
  ready=true;
  game_log("Game has begun", true);
});

$("#chat-tab").click(function(){
  $("#chat").slideDown();
});
$("#close-chat").click(function(){
  $("#chat").slideUp();
});
