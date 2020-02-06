// Make the chat box work, make the connections in the database work

var firebaseConfig = {
  apiKey: "AIzaSyBaJtL9JYA8EoPjNJ-G_bmrA2r6mGsmQNg",
  authDomain: "multiplayer-rps-7e427.firebaseapp.com",
  databaseURL: "https://multiplayer-rps-7e427.firebaseio.com",
  projectId: "multiplayer-rps-7e427",
  storageBucket: "multiplayer-rps-7e427.appspot.com",
  messagingSenderId: "39367904820",
  appId: "1:39367904820:web:49dad8636e423cac5c4461"
};
firebase.initializeApp(firebaseConfig);
let database = firebase.database();

// true is flag for player is connected
let connectedFlag = false;
// false is flag that no more players are needed
let needPlayers = true;
// Set to true if that is what the user's role is(player1, player2, or waiting to join the game)
let player1 = false;
let player2 = false;
let waiting = false;
let messages = [];
let name = "";
let connectedRef = database.ref(".info/connected");
let connectionsRef = database.ref("/connections");
let messagesRef = database.ref("/messages");
let playersRef = database.ref("/players");

// Add connected to firebase
function addConnected(name) {
  connectedRef.on("value", function(snap) {
    // Test and see if this feature is working
    if (snap.child("connections").numChildren() >= 2) {
      needPlayers = false;
    }

    // If they are connected and put a name in the start bar
    if (snap.val() && name != "") {
      var con = connectionsRef.push({
        connected: true,
        name: name,
        player: needPlayers,
        wins: 0,
        loses: 0
      });
      connectedFlag = true;
      con.onDisconnect().remove();
    }
  });
}

//  Display connected in text area
function displayConnected(name) {
  messages.push(name + " has connected.");
  messagesRef.push(name + " has connected.");
}

// Scrolls to the bottom of the text area
function scrollToBottom() {
  var textarea = document.getElementById("chat-box");
  textarea.scrollTop = textarea.scrollHeight;
}

// Puts all of the messages in messages array to the text area
function displayMessages() {
  $("#chat-box").empty();
  // Sets local array messages to what messages are saved in the database
  messagesRef.once("value", function(data) {
    let tempMessagesValue = Object.values(data.val());
    for (let i = 0; i < tempMessagesValue.length; i++) {
      messages[i] = tempMessagesValue[i];
    }
  });
  for (let i = 0; i < messages.length; i++) {
    $("#chat-box").append(messages[i] + "&#13;&#10;");
  }
  scrollToBottom();
}

function assignPlayers() {
  // if(needPlayers === true && snap.child("connections").numChildren() >= 2){
  // } else {
  // }
}

function playGame() {
  $(".name-input").empty();
  $(".name-input").append("<p>Hi " + name + "! You are <p>");
}

$(document).ready(function() {
  displayMessages();

  messagesRef.on("value", function(data) {
    displayMessages();
  });

  $("#start-button").on("click", function() {
    if ($("#name-input").val() === "" || connectedFlag === true) {
      return;
    } else {
      name = $("#name-input")
        .val()
        .trim();
      addConnected(name);
      displayConnected(name);
      displayMessages();
      assignPlayers();
      playGame();
    }
  });

  $("#message-send").on("click", function() {
    if (connectedFlag === false) {
      alert(
        "Please put your name in the top and connect to the game to type in chat."
      );
    } else {
      let tempMessage = $("#message")
        .val()
        .trim();
      $("#message").val("");
      messages.push(name + ": " + tempMessage);
      messagesRef.push(name + ": " + tempMessage);
      displayMessages();
    }
  });
});
