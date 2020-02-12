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
let turn;
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
let player1Choice;
let player2Choice;
let wins = 0;
let loses = 0;

function displayWinner() {
  console.log("asdf");
  player1Ref.once("value", function(data) {
    if (data.val().turn === true) {
      player1Ref.once("value", function(data) {
        player1Choice = data.val().choice;
      });
      player2Ref.once("value", function(data) {
        player2Choice = data.val().choice;
      });
      if (player1Choice === "rock") {
        if (player2Choice === "rock") {
          $("#middle-box").text("It's a draw");
          setTimeout(function() {
            $("#middle-box").empty();
          }, 4000);
          // Draw
        }
        if (player2Choice === "paper") {
          $("#middle-box").text("Player 2 wins!");
          player1Ref.once("value", function(data) {
            loses = data.val().loses;
          });
          player2Ref.once("value", function(data) {
            wins = data.val().wins;
          });

          player1Ref.update({
            loses: loses + 1
          });
          player2Ref.update({
            wins: wins + 1
          });
          setTimeout(function() {
            $("#middle-box").empty();
          }, 4000);
          // p2 winss
        }
        if (player2Choice === "scissors") {
          $("#middle-box").text("Player 1 wins!");
          player2Ref.once("value", function(data) {
            loses = data.val().loses;
          });
          player1Ref.once("value", function(data) {
            wins = data.val().wins;
          });

          player1Ref.update({
            wins: wins + 1
          });
          player2Ref.update({
            loses: loses + 1
          });
          setTimeout(function() {
            $("#middle-box").empty();
          }, 4000);
          // p1 wins
        }
      }
      if (player1Choice === "paper") {
        if (player2Choice === "rock") {
          $("#middle-box").text("Player 1 wins!");
          player2Ref.once("value", function(data) {
            loses = data.val().loses;
          });
          player1Ref.once("value", function(data) {
            wins = data.val().wins;
          });

          player1Ref.update({
            wins: wins + 1
          });
          player2Ref.update({
            loses: loses + 1
          });
          setTimeout(function() {
            $("#middle-box").empty();
          }, 4000);
          // p1 wins
        }
        if (player2Choice === "paper") {
          $("#middle-box").text("It's a draw");
          setTimeout(function() {
            $("#middle-box").empty();
          }, 4000);
          // draw
        }
        if (player2Choice === "scissors") {
          $("#middle-box").text("Player 2 wins!");
          player1Ref.once("value", function(data) {
            loses = data.val().loses;
          });
          player2Ref.once("value", function(data) {
            wins = data.val().wins;
          });

          player1Ref.update({
            loses: loses + 1
          });
          player2Ref.update({
            wins: wins + 1
          });
          setTimeout(function() {
            $("#middle-box").empty();
          }, 4000);
          // p2 wins
        }
      }
      if (player1Choice === "scissors") {
        if (player2Choice === "rock") {
          $("#middle-box").text("Player 2 wins!");
          player1Ref.once("value", function(data) {
            loses = data.val().loses;
          });
          player2Ref.once("value", function(data) {
            wins = data.val().wins;
          });

          player1Ref.update({
            loses: loses + 1
          });
          player2Ref.update({
            wins: wins + 1
          });
          setTimeout(function() {
            $("#middle-box").empty();
          }, 4000);
          // p2 wins
        }
        if (player2Choice === "paper") {
          $("#middle-box").text("Player 1 wins!");
          player2Ref.once("value", function(data) {
            loses = data.val().loses;
          });
          player1Ref.once("value", function(data) {
            wins = data.val().wins;
          });

          player2Ref.update({
            loses: loses + 1
          });
          player1Ref.update({
            wins: wins + 1
          });
          setTimeout(function() {
            $("#middle-box").empty();
          }, 4000);
          // p1 wins
        }
        if (player2Choice === "scissors") {
          $("#middle-box").text("It's a draw");
          setTimeout(function() {
            $("#middle-box").empty();
          }, 4000);
          // Draw
        }
      }
      player1Ref.update({
        choice: ""
      });
      player2Ref.update({
        choice: ""
      });
    }
  });
}

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
      player2Connected = false;
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

  if (player1Connected === true && player2Connected === true) {
    actualGameLogic();
  }
}

function actualGameLogic() {
  // turn is set to true if its your turn
  if (role === "player1") {
    player1Ref.once("value", function(data) {
      turn = data.val().turn;
    });
  } else if (role === "player2") {
    player2Ref.once("value", function(data) {
      turn = data.val().turn;
    });
  }

  // Player 1 Turn Code
  if (turn === true && role === "player1") {
    $("#turn-text").text("It's your turn.");
    let newRock = $("<div class='choice text-center' id='rock'>");
    newRock.text("Rock");
    let newPaper = $("<div class='choice text-center' id='paper'>");
    newPaper.text("Paper");
    let newScissors = $("<div class='choice text-center' id='scissors'>");
    let mainDiv = $("<div class='choices'>");
    newScissors.text("Scissors");
    $(mainDiv).append(newRock);
    $(mainDiv).append(newPaper);
    $(mainDiv).append(newScissors);
    $("#player-1").append(mainDiv);

    $(document).on("click", ".choice", function() {
      turn = false;
      $("#turn-text").empty();
      $("#turn-text").text("Its your opponents turn.");
      mainDiv.empty();
      player1Ref.update({
        choice: this.id,
        turn: false
      });
      player2Ref.update({
        turn: true
      });
      displayWinner();
    });
  }

  // Player 2 Turn Code
  if (turn === true && role === "player2") {
    $("#turn-text").text("It's your turn.");
    let newRock = $("<div class='choice text-center' id='rock'>");
    newRock.text("Rock");
    let newPaper = $("<div class='choice text-center' id='paper'>");
    newPaper.text("Paper");
    let newScissors = $("<div class='choice text-center' id='scissors'>");
    let mainDiv = $("<div class='choices'>");
    newScissors.text("Scissors");
    $(mainDiv).append(newRock);
    $(mainDiv).append(newPaper);
    $(mainDiv).append(newScissors);
    $("#player-2").append(mainDiv);

    $(document).on("click", ".choice", function() {
      turn = false;
      $("#turn-text").empty();
      $("#turn-text").text("Its your opponents turn.");
      mainDiv.empty();
      player1Ref.update({
        turn: true
      });
      player2Ref.update({
        choice: this.id,
        turn: false
      });
      displayWinner();
    });
  }
}

function playGame(role) {
  $(".name-input").empty();
  $(".name-input").append("<p>Hi " + name + "! You are " + role + "</p>");

  if (role === "player1") {
    player1Ref.set({
      playerName: name,
      choice: "rock", // This will change whenever the game is played
      wins: 0,
      loses: 0,
      turn: true
    });
    player1Ref.onDisconnect().remove();
  } else if (role === "player2") {
    player2Ref.set({
      playerName: name,
      choice: "rock",
      wins: 0,
      loses: 0,
      turn: false
    });
    player2Ref.onDisconnect().remove();
  } else {
    // Create a modal that says you are allowed to talk in chat you just won't  be able to play the game until someone leaves. When someone leaves, refresh the page, and join in.
    return;
  }

  displayingGame();
}

$(document).ready(function() {
  displayMessages();
  displayingGame();

  messagesRef.on("value", function(data) {
    displayMessages();
  });

  player1Ref.on("value", function(data) {
    displayingGame();
  });

  player2Ref.on("value", function(data) {
    displayingGame();
  });

  $("#start-button").on("click", function(event) {
    event.preventDefault();
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

  $("#message-send").on("click", function(event) {
    event.preventDefault();
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
