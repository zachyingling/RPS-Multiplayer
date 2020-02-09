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
let messages = [];
let name = "";
let role = "";
let player1Connected = false;
let player2Connected = false;
let connectedRef = database.ref(".info/connected");
let connectionsRef = database.ref("/connections");
let messagesRef = database.ref("/messages");
let player1Ref = database.ref("/player1");
let player2Ref = database.ref("/player2");

// Add connected to firebase
function addConnected() {
  connectedRef.on("value", function(snap) {
    // Test and see if this feature is working
    if (snap.child("connections").numChildren() >= 2) {
      needPlayers = false;
    }

    // If they are connected and put a name in the start bar
    if (snap.val() && name != "") {
      let con = connectionsRef.push({
        connected: true,
        playerName: name,
        playerRole: role
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
  connectionsRef.once("value").then(function(snap) {
    if (needPlayers === true && snap.numChildren() == 0) {
      role = "player1";
    } else if (needPlayers === true && snap.numChildren() == 1) {
      role = "player2";
    } else {
      role = "waiting";
    }
    addConnected();
    playGame(role);
  });
}

function displayingGame() {
  player1Ref.on("value", function(snap) {
    if (snap.val() === null) {
      $("#player-1").empty();
      $("#player-1").text("Waiting for player 1.");
    } else {
      $("#player-1").empty();
      let newName = $("<h3>");
      newName.text(snap.val().playerName);
      newName.attr("class", "text-center");
      $("#player-1").prepend(newName);

      let statTracker = $("<p>");
      statTracker.attr("class", "text-center stat-tracker");
      statTracker.text(
        "Wins: " + snap.val().wins + " Loses: " + snap.val().loses
      );
      $("#player-1").append(statTracker);
      player1Connected = true;
    }
  });

  player2Ref.on("value", function(snap) {
    if (snap.val() === null) {
      $("#player-2").empty();
      $("#player-2").text("Waiting for player 2.");
    } else {
      $("#player-2").empty();
      let newName = $("<h3>");
      newName.text(snap.val().playerName);
      newName.attr("class", "text-center");
      $("#player-2").prepend(newName);

      let statTracker = $("<p>");
      statTracker.attr("class", "text-center stat-tracker");
      statTracker.text(
        "Wins: " + snap.val().wins + " Loses: " + snap.val().loses
      );
      $("#player-2").append(statTracker);
      player2Connected = true;
    }
  });
}

function actualGameLogic() {}

function playGame(role) {
  $(".name-input").empty();
  $(".name-input").append("<p>Hi " + name + "! You are " + role + "</p>");

  if (role === "player1") {
    player1Ref.set({
      playerName: name,
      choice: "rock",
      wins: 0,
      loses: 0
    });
    player1Ref
      .onDisconnect()
      .remove()
      .then(function() {
        player1Connected = false;
      });
  } else if (role === "player2") {
    player2Ref.set({
      playerName: name,
      choice: "rock",
      wins: 0,
      loses: 0
    });
    player2Ref
      .onDisconnect()
      .remove()
      .then(function() {
        player2Connected = false;
      });
  } else {
    // Create a modal that says you are allowed to talk in chat you just won't  be able to play the game until someone leaves. When someone leaves, refresh the page, and join in.
    return;
  }

  displayingGame();
  if (player1Connected === true && player2Connected === true) {
    console.log("ffjghdjkfgid");
  }
}

$(document).ready(function() {
  displayMessages();
  displayingGame();

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
      displayConnected(name);
      displayMessages();
      assignPlayers();
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
