function trump_shoot(player){
  $("#canvas").append("<div id='tbullet' class='trump-bullet bullet'>WRONG</div>");
  $("#tbullet").css('top', parseInt($("#trump").css('top'))+50);
  $("#tbullet").animate({right: "900"}, 1000, "linear", function(){
    if(player=="trump"){
      socket.emit('shot',parseInt($("#tbullet").css('top')),parseInt($(opp_sprite).css('top')),player);
    }
    $("#tbullet").remove();
  });
}

function clinton_shoot(player){
  $("#canvas").append("<div id='cbullet' class='clinton-bullet bullet'></div>");
  $("#cbullet").css('top', parseInt($("#clinton").css('top'))+50);
  $("#cbullet").animate({left: "900"}, 1000, "linear", function(){
    if(player=="clinton"){
      socket.emit('shot',parseInt($("#cbullet").css('top')),parseInt($(opp_sprite).css('top')),player);
    }
    $("#cbullet").remove();
  });
}

function initialize(player){
  init = true;
  console.log("You are "+player);
  health = 500;
  opp_health = 500;
  var power = 100;
  //sets variables
  if(player=="trump"){
    player="trump";
    sprite="#trump";
    mana_div="#mana_div-trump";
    opp_sprite="#clinton";
  }
  else if(player=="clinton"){
    player="clinton";
    sprite="#clinton";
    mana_div="#mana_div-clinton";
    opp_sprite="#trump";
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
        socket.emit('up',player);
      }
      if (direction == 40) {
        socket.emit('down',player);
      }
    }
  }

  socket.on('move-up', function(name){
    if(parseInt($("#"+name).css('top'))>=10){
      $("#"+name).animate({top: "-=10"}, 0);
    }
  });
  socket.on('move-down', function(name){
    if(parseInt($("#"+name).css('top'))<=390){
      $("#"+name).animate({top: "+=10"}, 0);
    }
  });

  $(document).keyup(function(e){
     if(e.keyCode == 32){
       socket.emit('player-shoots', player);
     }
  });
  socket.on('trump-shoot', function(){
    if(power==100){
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
    if(power==100){
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
    console.log("clinton hit");
    if(player=="clinton"){
      socket.emit('health',player);
      console.log("Health emited");
    }
  });
  socket.on('trump-hit',function(){
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
