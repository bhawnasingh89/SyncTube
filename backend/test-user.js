import { io } from "socket.io-client";

// Put the CURRENT room ID created by test-client.js here
const ROOM_ID = "b43669";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("\nUser 2 connected!");
  console.log("Socket ID:", socket.id);

  socket.emit("join_room", {
    roomId: ROOM_ID,
    username: "Rahul",
  });
});

socket.on("sync_state", (data) => {
  console.log("\n===== SYNC STATE =====");
  console.log(data);
});

socket.on("user_joined", (data) => {
  console.log("\n===== USER JOINED =====");
  console.log(data);
});

socket.on("user_left", (data) => {
  console.log("\n===== USER LEFT =====");
  console.log(data);
});

socket.on("role_assigned", (data) => {
  console.log("\n===== ROLE ASSIGNED =====");
  console.log(data);
});

socket.on("participant_removed", (data) => {
  console.log("\n===== PARTICIPANT REMOVED =====");
  console.log(data);
});

socket.on("play", (data) => {
  console.log("\n===== PLAY RECEIVED =====");
  console.dir(data, { depth: null });
});

socket.on("pause", (data) => {
  console.log("\n===== PAUSE RECEIVED =====");
  console.dir(data, { depth: null });
});

socket.on("seek", (data) => {
  console.log("\n===== SEEK RECEIVED =====");
  console.dir(data, { depth: null });
});

socket.on("change_video", (data) => {
  console.log("\n===== VIDEO CHANGED =====");
  console.log(data);
});

socket.on("room_closed", () => {
  console.log("\n===== ROOM CLOSED =====");
});

socket.on("error", (data) => {
  console.log("\nSERVER ERROR:", data);
});

socket.on("disconnect", () => {
  console.log("\nUser 2 disconnected");
});

// Keep User 2 connected
process.stdin.resume();