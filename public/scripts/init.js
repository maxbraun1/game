// Set socket
//var socket = io.connect("http://localhost:3000"); //local
var socket = io.connect("http://softbatch.dynu.com:3000"); //Main
//var socket = io.connect("http://159.203.164.204:3000");//Test

// Setup variables
var room;
var username;
var init = false;
var power;
var player = null;
var wall = false;
var email = false;
var impeach = false;
var warmup = 100;
var ready;
var once = true;
var side_div;
var side;
var new_lobby;
var opp;
var opp_sprite;
var bullet_travel = {};
var bullet_side;
var opp_side;

$("#chat").hide();

$(side).append("<div class='sprite' id='bill'><div id='mana_div-bill' class='mana_div'></div></div>")

// Game Notifications

new PNotify({
  title: 'New Domain',
  text: 'This game can now be found at <strong>tvcgame.us</strong>',
  type: 'info',
  icon: false
});

$("#create").click(function(){
  new_lobby = true;
  $(".darken").fadeIn();
  $("#player-select").fadeIn();
});

$("#join").click(function(){
  check_lobby($("#lobby-id").val());
  new_lobby = false;
});

$("#player-select-cancel").click(function(){
  $(".darken").fadeOut();
  $("#player-select").fadeOut();
});

$("#lobby-id").keyup(function(){
  if($("#lobby-id").val().length < 1 || $("#username").val().length < 1){
    $("#create").addClass("disabled");
    $("#join").addClass("disabled");
  }else{
    $("#create").removeClass("disabled");
    $("#join").removeClass("disabled");
  }
});

$("#username").keyup(function(){
  if($("#lobby-id").val().length < 1 || $("#username").val().length < 1){
    $("#create").addClass("disabled");
    $("#join").addClass("disabled");
  }else{
    $("#create").removeClass("disabled");
    $("#join").removeClass("disabled");
  }
});

$("#trump-choice").click(function(){
  username = $("#username").val();
  room = $("#lobby-id").val();
  if(create==false){
    socket.emit('join-room',room,"trump",username);
  }
  $("title").html("TvC Room: "+room);
  $("#menu-room-id").html(room);
  $(".darken").hide();
  $("#player-select").hide();
  $("#opener").hide();
  init_trump(username,room,new_lobby);
});

$("#clinton-choice").click(function(){
  username = $("#username").val();
  room = $("#lobby-id").val();
  if(create==false){
    socket.emit('join-room',room,"trump",username);
  }
  $("title").html("TvC Room: "+room);
  $("#menu-room-id").html(room);
  $(".darken").hide();
  $("#player-select").hide();
  $("#opener").hide();
  init_clinton(username,room,new_lobby);
});

$("#bill-choice").click(function(){
  username = $("#username").val();
  room = $("#lobby-id").val();
  if(create==false){
    socket.emit('join-room',room,"bill",username);
  }
  $("title").html("TvC Room: "+room);
  $("#menu-room-id").html(room);
  $(".darken").hide();
  $("#player-select").hide();
  $("#opener").hide();
  init_bill(username,room,new_lobby);
});
