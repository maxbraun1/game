// Controls
setInterval(movePlane, 20);
var keys = {}
$(document).keydown(function(e) {
    keys[e.keyCode] = true;
});
$(document).keyup(function(e) {
    delete keys[e.keyCode];
});

$(document).keypress(function(e) {
  if(e.which == 112) {
    if(ready==true){
      if(player=="trump"){
        socket.emit('powerup-trump');
      }else if(player=="clinton"){
        socket.emit('powerup-clinton');
      }
    }else{
      game_log("Wait for another user to connect to begin!");
    }
  }
});

function movePlane() {
  for (var direction in keys) {
    if (!keys.hasOwnProperty(direction)) continue;
    if (direction == 38) {
      if(ready==true){
        socket.emit('up',player);
      }else{
        game_log("Wait for another user to connect to begin!");
      }
    }
    if (direction == 40) {
      if(ready==true){
        socket.emit('down',player);
      }else{
        game_log("Wait for another user to connect to begin!");
      }
    }
  }
}

$(document).keyup(function(e){
   if(e.keyCode == 32){
     if(ready==true){
       if(power==100){
         power=0;
         socket.emit('player-shoots', player);
       }
     }else{
       game_log("Wait for another user to connect to begin!");
     }
   }
});

// Server sends

socket.on('player-check',function(socketID){
  socket.emit('existing-player',player,socketID);
});
socket.on('join',function(player){
  show_options(player);
  opp = player;
  opp_sprite = "#"+player;
});
socket.on('player-joined',function(room,player_char,username){
  if(player!=player_char){
    opp = player_char;
    opp_sprite = "#"+player_char;
    show_opp_sprite(player_char);
  }
});
socket.on('ready',function(){
  ready=true;
});
socket.on('move-up', function(name){
  if(parseInt($("#"+name).css('top'))>=20){
    $("#"+name).animate({top: "-=10"}, 0);
  }
});
socket.on('move-down', function(name){
  if(parseInt($("#"+name).css('top'))<=350){
    $("#"+name).animate({top: "+=10"}, 0);
  }
});

socket.on('trump-shoot', function(){
  if(email==true){
    trump_shoot_email(player);
    if(player == "trump"){
      power = 0;
      $(mana_div).css("height",0);
      $(mana_div).animate({height: 100}, 1000, "linear",function(){
        power=100;
      });
    }
  }else{
    trump_shoot(player);
    if(player == "trump"){
      power = 0;
      $(mana_div).css("height",0);
      $(mana_div).animate({height: 100}, 1000, "linear",function(){
        power=100;
      });
    }
  }
});
socket.on('clinton-shoot', function(){
  if(wall==true){
    clinton_shoot_wall(player);
    if(player == "clinton"){
      power = 0;
      $(mana_div).css("height",0);
      $(mana_div).animate({height: 100}, 1000, "linear",function(){
        power=100;
      });
    }
  }else{
    clinton_shoot(player);
    if(player == "clinton"){
      power = 0;
      $(mana_div).css("height",0);
      $(mana_div).animate({height: 100}, 1000, "linear",function(){
        power=100;
      });
    }
  }
});
socket.on('clinton-hit',function(){
  $("#clinton").effect( "shake", {times:2},200 );
  if(player=="clinton"){
    socket.emit('health',player);
  }
});
socket.on('trump-hit',function(){
  $("#trump").effect( "shake", {times:2},200);
  if(player=="trump"){
    socket.emit('health',player);
  }
});
socket.on('update-health',function(hit_player,health){
  if(hit_player==player){
    $("#player-health").animate({width: health}, 100, "linear");
  }else{
    $("#opp-health").animate({width: health}, 100, "linear");
  }
});

socket.on('wall',function(){
  wall();
});
socket.on('email',function(){
  email();
});

socket.on('player-left', function(username){
  new PNotify({
    title: 'User Left!',
    text: 'Opps! <strong>'+username+'</strong> left the room...',
    type: 'error'
});
ready=false;
});

socket.on('count',function(count){
  $("#count-span").html(count);
});
