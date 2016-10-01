var socket = io.connect("http://159.203.151.179:3000"); //http://159.203.151.179:3000/

var player;

$("#choose-trump").click(function(){
  player="trump";
  $("#choose-clinton").css("background-color", "#404040");
  $("#choose-trump").css("background-color", "#006bb3");
});
$("#choose-clinton").click(function(){
  player="clinton";
  $("#choose-trump").css("background-color", "#404040");
  $("#choose-clinton").css("background-color", "#006bb3");
});
$("#create").click(function(){
  $("#as-name").html(player);
  $(".darken").fadeIn(function(){
    $("#create-game").fadeIn();
  });
});
$("#cancel").click(function(){
  $(".darken").hide();
  $("#create-game").hide();
});
$("#join").click(function(){
  $("#as-name").html(player);
  $(".darken").fadeIn(function(){
    $("#join-game").fadeIn();
  });
});
$("#join-game-form").submit(function(e){
  e.preventDefault();
  room = $("#join-id").val();
  $("title").html("TvC Room: "+room);
  $("#menu-room-id").html(room);
  socket.emit('join-room', room);
  $(".darken").hide();
  $("#join-game").hide();
  $("#opener").hide();
  initialize();
});
$("#create-game-form").submit(function(e){
  e.preventDefault();
  var room = $("#room-id").val();
  $("title").html("TvC Room: "+room);
  $("#menu-room-id").html(room);
  socket.emit('new-room', room);
  $(".darken").hide();
  $("#create-game").hide();
  $("#opener").hide();
  initialize();
});
