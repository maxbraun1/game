function trump_shoot(player){
  $("#canvas").append("<div id='tbullet' class='trump-bullet bullet'>WRONG</div>");
  $("#tbullet").css('top', parseInt($("#trump").css('top'))+45);
  $("#tbullet").animate({right: "900"}, 500, "linear", function(){
    if(player=="trump"){
      socket.emit('shot',parseInt($("#tbullet").css('top')),parseInt($(opp_sprite).css('top')),player);
    }
    $("#tbullet").remove();
  });
}
function trump_shoot_email(player){
  $("#tbullet").remove();
  $("#canvas").append("<div id='tbullet' class='trump-bullet email bullet'></div>");
  $("#tbullet").css('top', parseInt($("#trump").css('top'))+45);
  $("#tbullet").animate({right: "500"}, 250, "linear", function(){
    $(".email").css("background-image","url('/assets/x.png')");
    setTimeout(function() {
      $("#tbullet").remove();
    }, 500);
  });
}

function clinton_shoot(player){
  $("#canvas").append("<div id='cbullet' class='clinton-bullet bullet'>SEXIST</div>");
  $("#cbullet").css('top', parseInt($("#clinton").css('top'))+45);
  $("#cbullet").animate({left: "900"}, 500, "linear", function(){
    if(player=="clinton"){
      socket.emit('shot',parseInt($("#cbullet").css('top')),parseInt($(opp_sprite).css('top')),player);
    }
    $("#cbullet").remove();
  });
}

function clinton_shoot_wall(player){
  $("#canvas").append("<div id='cbullet' class='clinton-bullet bullet'>SEXIST</div>");
  $("#cbullet").css('top', parseInt($("#clinton").css('top'))+45);
  if(parseInt($("#cbullet").css('top'))>90 && parseInt($("#cbullet").css('top'))<=300){
    //If bullet is in range of wall
    $("#cbullet").animate({left: "400"}, 250, "linear", function(){
      $("#cbullet").remove();
    });
  }else{
    $("#cbullet").animate({left: "900"}, 500, "linear", function(){
      if(player=="clinton"){
        socket.emit('shot',parseInt($("#cbullet").css('top')),parseInt($(opp_sprite).css('top')),player);
      }
      $("#cbullet").remove();
    });
  }
}

function initialize(player_name){
  init = true;
  player = player_name;
  game_log("You are "+player);
  health = 500;
  opp_health = 500;
  var power = 100;
  //sets variables
  if(player=="trump"){
    sprite="#trump";
    mana_div="#mana_div-trump";
    opp_sprite="#clinton";
    $("#trump-powerup").fadeIn();
  }
  else if(player=="clinton"){
    sprite="#clinton";
    mana_div="#mana_div-clinton";
    opp_sprite="#trump";
    $("#clinton-powerup").fadeIn();
  }

  setInterval(movePlane, 20);
  var keys = {}
  $(document).keydown(function(e) {
      keys[e.keyCode] = true;
  });
  $(document).keyup(function(e) {
      delete keys[e.keyCode];
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
}

function game_log(message, override){
  if(once==true | override==true ){
    once=false;
    $('#log').fadeOut(function(){
      $('#log').html(message);
    });
    $('#log').fadeIn();
    setTimeout(function() {
      $("#log").fadeOut(function(){
        $('#log').html("<span id='default'>Game Console</span>");
      });
      $('#log').fadeIn(function(){
        once=true;
      });
    }, 3000);
  }
}

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

socket.on('wall',function(){
  wall();
});
socket.on('email',function(){
  email();
});

function wall(){
  wall=true;
  $("#wall").fadeIn();
  if(player=="trump"){
    $("#trump-warmup").css("width",0);
    $("#trump-warmup").css("background-color","rgba(255,0,0,0.4)");
    $("#trump-warmup").animate({width: "100%"}, 15000, "linear");
  }
  game_log("Trump uses BUILD A WALL");
  setTimeout(function() {
    wall=false;
    $("#wall").fadeOut();
  }, 15000);
}
function email(){
  email=true;
  if(player=="clinton"){
    $("#clinton-warmup").css("width",0);
    $("#clinton-warmup").css("background-color","rgba(255,0,0,0.4)");
    $("#clinton-warmup").animate({width: "100%"}, 15000, "linear");
  }
  game_log("Clinton uses ACCEDENTAL DELETION");
  setTimeout(function() {
    email=false;
  }, 15000);
}
function getPlayer(){
  socket.emit('getPlayer');
  socket.on('player',function(theplayer){
    player = theplayer;
  });
  return player;
}

socket.on('player-left', function(username){
  new PNotify({
    title: 'User Left!',
    text: 'Opps! '+username+' left the room...',
    type: 'error'
});
ready=false;
});

socket.on('count',function(count){
  $("#count-span").html(count);
});

$('#message-area').keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
    var message = $("#message-area").val();
    $("#message-area").val("");
    socket.emit('message', message);
  }
});

socket.on('new-message',function(message){
  var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  $("#chat-msgs").prepend("<div class='message'>"+message+"<p id='date'>At <span id='date-time'>"+datetime+"</span></p></div>");
});

$(".alert-close").click(function(){
  permanotice.remove();
});
