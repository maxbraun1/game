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
function check_lobby(lobby){
  socket.emit('check_lobby',lobby);
}
function show_options(player){
  if(player=="trump"){
    $("#trump-choice").addClass("disabled");
  }else if(player=="clinton"){
    $("#clinton-choice").addClass("disabled");
  }else if(player=="bill"){
    $("#bill-choice").addClass("disabled");
  }
  $(".darken").fadeIn();
  $("#player-select").fadeIn();
}

function show_opp_sprite(opp){
  if(side=="left"){
    $("#side2").append("<div class='sprite right' id='"+opp+"'><div id='mana_div-"+opp+"' class='mana_div'></div></div>");
    $("#"+opp).fadeIn();
  }else if(side=="right"){
    $("#side1").append("<div class='sprite left' id='"+opp+"'><div id='mana_div-"+opp+"' class='mana_div'></div></div>");
    $("#"+opp).fadeIn();
  }
}
