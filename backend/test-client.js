import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

let roomId = null;

socket.on("connect", () => {
  console.log("\nHost connected!");
  console.log("Socket ID:", socket.id);
 
  socket.emit("create_room", {
    username: "Bhawna",
    videoId: "dQw4w9WgXcQ",
  });
});

socket.on("room_created", (data) => {
  console.log("\n==============================");
  console.log("       ROOM CREATED");
  console.log("==============================");
  console.log("ROOM ID:", data.roomId);
  console.log("==============================");
  console.log("Host is staying connected.");
  console.log("Now use this Room ID in test-user.js");
  console.log("Press Ctrl+C ONLY when you want to close the room.\n");

  roomId = data.roomId;
});


socket.on("user_joined", (data) => {
  console.log("\nUSER JOINED:", data);
});

socket.on("user_left", (data) => {
  console.log("\nUSER LEFT:", data);
});

socket.on("room_closed", () => {
  console.log("\nROOM CLOSED");
});

socket.on("error", (data) => {
  console.log("\nSERVER ERROR:", data);
});

socket.on("disconnect", () => {
  console.log("\nHOST DISCONNECTED");
});

// Keep this Node process alive
process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
  const command = input.trim();

  console.log("COMMAND RECEIVED:", command);

  if (!roomId) {
    console.log("Room is not created yet.");
    return;
  }

  if (command === "p") {
    console.log("\nHOST → PLAY");

    socket.emit("play", {
      roomId,
      currentTime: 10,
    });
  }

  if (command === "a") {
    console.log("\nHOST → PAUSE");

    socket.emit("pause", {
      roomId,
      currentTime: 15,
    });
  }

  if (command === "s") {
    console.log("\nHOST → SEEK TO 30 SECONDS");

    socket.emit("seek", {
      roomId,
      currentTime: 30,
    });
  }

  if (command === "v") {
    console.log("\nHOST → CHANGE VIDEO");

    socket.emit("change_video", {
      roomId,
      videoId: "9bZkp7q19f0",
    });
  }

if (command === "r") {
  console.log("\nHOST → ASSIGN PARTICIPANT ROLE");

  socket.emit("assign_role", {
    roomId,
    userId: "PASTE_USER_2_SOCKET_ID_HERE",
    role: "moderator",
  });
}
});

console.log("\nCommands:");
console.log("p = Play");
console.log("a = Pause");
console.log("s = Seek");
console.log("v = Change Video");
console.log("r = Assign moderator role")

process.stdin.resume();

process.stdin.resume();