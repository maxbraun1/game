function init_clinton(username,room,create){
  // Set vars for trump
  room=room;
  init = true;
  room = room;
  player = "clinton";
  game_log("You are Clinton");
  health = 500;
  opp_health = 500;
  power = 100;
  sprite="#clinton";
  mana_div="#mana_div-clinton";
  $("#clinton-powerup").fadeIn();


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

  $(side_div).append("<div class='sprite "+side+"' id='clinton'><div id='mana_div-clinton' class='mana_div'></div></div>");
  $(sprite).fadeIn();
}

function clinton_shoot(player){
  bullet_travel={};
  if(player=="clinton"){
    bullet_travel[side]=900;
    bullet_side = side;
  }else{
    bullet_travel[opp_side]=900;
    bullet_side = opp_side;
  }
  $("#canvas").append("<div id='cbullet' class='clinton-bullet "+bullet_side+"-bullet bullet'>SEXIST</div>");
  $("#cbullet").css('top', parseInt($("#clinton").css('top'))+45);
  $("#cbullet").animate(bullet_travel, 500, "linear", function(){
    if(player=="clinton"){
      socket.emit('shot',parseInt($("#cbullet").css('top')),parseInt($(opp_sprite).css('top')),opp);
    }
    $("#cbullet").remove();
  });
}

function clinton_shoot_wall(player){
  bullet_travel={};
  if(player=="clinton"){
    bullet_travel[side]=500;
    bullet_side = side;
  }else{
    bullet_travel[opp_side]=500;
    bullet_side = opp_side;
  }
  $("#canvas").append("<div id='cbullet' class='clinton-bullet "+bullet_side+"-bullet bullet'>SEXIST</div>");
  $("#cbullet").css('top', parseInt($("#clinton").css('top'))+45);
  if(parseInt($("#cbullet").css('top'))>90 && parseInt($("#cbullet").css('top'))<=300){
    //If bullet is in range of wall
    $("#cbullet").animate(bullet_travel, 250, "linear", function(){
      $("#cbullet").remove();
    });
  }else{
    if(player=="clinton"){
      bullet_travel[side]=900;
    }else{
      bullet_travel[opp_side]=900;
    }
    $("#cbullet").animate(bullet_travel, 500, "linear", function(){
      if(player=="clinton"){
        socket.emit('shot',parseInt($("#cbullet").css('top')),parseInt($(opp_sprite).css('top')),opp);
      }
      $("#cbullet").remove();
    });
  }
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
