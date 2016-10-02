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
