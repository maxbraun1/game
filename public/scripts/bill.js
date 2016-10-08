function init_bill(username,room,create){
  // Set vars for bill
  room=room;
  init = true;
  room = room;
  player = "bill";
  game_log("You are Bill");
  health = 500;
  opp_health = 500;
  power = 100;
  sprite="#bill";
  mana_div="#mana_div-bill";
  $("#bill-powerup").fadeIn();


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

  $(side_div).append("<div class='sprite "+side+"' id='bill'><div id='mana_div-bill' class='mana_div'></div></div>");
  $(sprite).fadeIn();
}

function bill_shoot(player){
  bullet_travel={};
  if(player=="bill"){
    bullet_travel[side]=900;
    bullet_side = side;
  }else{
    bullet_travel[opp_side]=900;
    bullet_side = opp_side;
  }
  $("#canvas").append("<div id='bbullet' class='bill-bullet "+bullet_side+"-bullet bullet'>LEWINSKY</div>");
  $("#bbullet").css('top', parseInt($("#bill").css('top'))+45);
  $("#bbullet").animate(bullet_travel, 500, "linear", function(){
    if(player=="bill"){
      socket.emit('shot',parseInt($("#bbullet").css('top')),parseInt($(opp_sprite).css('top')),opp);
    }
    $("#bbullet").remove();
  });
}
function bill_shoot_email(player){
  bullet_travel={};
  if(player=="bill"){
    bullet_travel[side]=900;
    bullet_side = side;
  }else{
    bullet_travel[opp_side]=900;
    bullet_side = opp_side;
  }
  $("#bbullet").remove();
  $("#canvas").append("<div id='bbullet' class='bill-bullet "+bullet_side+"-bullet email bullet'></div>");
  $("#bbullet").css('top', parseInt($("#bill").css('top'))+45);
  $("#bbullet").animate(bullet_travel, 500, "linear", function(){
    $(".email").css("background-image","url('/assets/x.png')");
    setTimeout(function() {
      $("#bbullet").remove();
    }, 500);
  });
}
function bill_shoot_wall(player){
  bullet_travel={};
  if(player=="bill"){
    bullet_travel[side]=500;
    bullet_side = side;
  }else{
    bullet_travel[opp_side]=500;
    bullet_side = opp_side;
  }
  $("#canvas").append("<div id='bbullet' class='bill-bullet "+bullet_side+"-bullet bullet'>LEWINSKY</div>");
  $("#bbullet").css('top', parseInt($("#bill").css('top'))+45);
  if(parseInt($("#bbullet").css('top'))>90 && parseInt($("#bbullet").css('top'))<=300){
    //If bullet is in range of wall
    $("#bbullet").animate(bullet_travel, 250, "linear", function(){
      $(this).remove();
    });
  }else{
    if(player=="bill"){
      bullet_travel[side]=900;
    }else{
      bullet_travel[opp_side]=900;
    }
    $("#bbullet").animate(bullet_travel, 500, "linear", function(){
      if(player=="bill"){
        socket.emit('shot',parseInt($("#bbullet").css('top')),parseInt($(opp_sprite).css('top')),opp);
      }
      $("#bbullet").remove();
    });
  }
}

function impeach(){
  impeach=true;
  if(player=="bill"){
    $("#bill").animate({opacity:.5});
    $("#bill-warmup").css("width",0);
    $("#bill-warmup").css("background-color","rgba(255,0,0,0.4)");
    $("#bill-warmup").animate({width: "100%"}, 15000, "linear");
  }else{
    $("#bill").animate({opacity:0});
  }
  game_log("Bill uses IMPEACHMENT");
  setTimeout(function() {
    impeach=false;
    $("#bill").animate({opacity:1});
  }, 15000);
}
