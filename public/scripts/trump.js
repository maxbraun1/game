function init_trump(username,room,create){
  // Set vars for trump
  room=room;
  init = true;
  room = room;
  player = "trump";
  game_log("You are Trump");
  health = 500;
  opp_health = 500;
  power = 100;
  sprite="#trump";
  mana_div="#mana_div-trump";
  $("#trump-powerup").fadeIn();


  if(create==true){
    //Creating new room
    socket.emit('new-room', room,player,username);
    ready=false;
    side_div = "#side1";
    side = "left";
    opp_side = "right";
  }else if(create==false){
    //Joining existing room
    socket.emit('join-room', room,player,username);
    socket.emit('game-ready');
    side_div = "#side2";
    side = "right";
    opp_side = "left";
    show_opp_sprite(opp);
  }else{
    alert("No create variable");
  }

  $(side_div).append("<div class='sprite "+side+"' id='trump'><div id='mana_div-trump' class='mana_div'></div></div>");
  $(sprite).fadeIn();
}

function trump_shoot(player){
  bullet_travel={};
  if(player=="trump"){
    bullet_travel[side]=900;
    bullet_side = side;
  }else{
    bullet_travel[opp_side]=900;
    bullet_side = opp_side;
  }
  $("#canvas").append("<div id='tbullet' class='trump-bullet "+bullet_side+"-bullet bullet'>WRONG</div>");
  $("#tbullet").css('top', parseInt($("#trump").css('top'))+45);
  $("#tbullet").animate(bullet_travel, 500, "linear", function(){
    if(player=="trump"){
      socket.emit('shot',parseInt($("#tbullet").css('top')),parseInt($(opp_sprite).css('top')),opp);
    }
    $("#tbullet").remove();
  });
}
function trump_shoot_email(player){
  bullet_travel={};
  if(player=="trump"){
    bullet_travel[side]=900;
    bullet_side = side;
  }else{
    bullet_travel[opp_side]=900;
    bullet_side = opp_side;
  }
  $("#tbullet").remove();
  $("#canvas").append("<div id='tbullet' class='trump-bullet "+bullet_side+"-bullet email bullet'></div>");
  $("#tbullet").css('top', parseInt($("#trump").css('top'))+45);
  $("#tbullet").animate(bullet_travel, 500, "linear", function(){
    $(".email").css("background-image","url('/assets/x.png')");
    setTimeout(function() {
      $("#tbullet").remove();
    }, 500);
  });
}

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
