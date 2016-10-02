var socket = io.connect("http://159.203.151.179:3000"); //http://159.203.151.179:3000/

var player;
var room;
var username;
var init = false;

$("#choose-trump").click(function(){
  player="trump";
  $("#choose-clinton").css("background-color", "#404040");
  $("#choose-trump").css("background-color", "#006bb3");
  $("#create").removeClass('disabled');
});
$("#choose-clinton").click(function(){
  player="clinton";
  $("#choose-trump").css("background-color", "#404040");
  $("#choose-clinton").css("background-color", "#006bb3");
  $("#create").removeClass('disabled');
});
$("#create").click(function(){
  $("#as-name").html(player);
  $(".darken").fadeIn(function(){
    $("#create-game").fadeIn();
  });
});
$("#create-cancel").click(function(){
  $(".darken").hide();
  $("#create-game").hide();
});
$("#join-cancel").click(function(){
  $(".darken").hide();
  $("#join-game").hide();
});
$("#join").click(function(){
  $("#as-name").html(player);
  $(".darken").fadeIn(function(){
    $("#join-game").fadeIn();
  });
});
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
      initialize("clinton");
      socket.emit('new-player-info', "Clinton",username,room);
    }else if(player=="clinton"){
      initialize("trump");
      socket.emit('new-player-info', "Trump",username,room);
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
$(".ok").click(function(){
  document.location.reload(true);
});
