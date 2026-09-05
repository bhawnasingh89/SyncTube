export default function socketHandlers(io, roomManager) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ==========================================
    // CREATE ROOM
    // ==========================================

    socket.on("create_room", ({ username, videoId }) => {
      try {
        console.log("CREATE ROOM REQUEST:", {
          username,
          videoId,
          socketId: socket.id,
        });

        const room = roomManager.createRoom(
          socket.id,
          username,
          videoId
        );

        socket.join(room.roomId);
        socket.roomId = room.roomId;

        console.log("ROOM CREATED:", room);

        socket.emit("room_created", {
          roomId: room.roomId,
          room,
        });
      } catch (error) {
        console.error("CREATE ROOM ERROR:", error);

        socket.emit("error", {
          message: "Failed to create room",
        });
      }
    });

    // ==========================================
    // JOIN ROOM
    // ==========================================

    socket.on("join_room", ({ roomId, username }) => {
      try {
        console.log("JOIN ROOM REQUEST:", {
          roomId,
          username,
          socketId: socket.id,
        });

        const room = roomManager.getRoom(roomId);

        console.log("ROOM FOUND:", room);

        if (!room) {
          socket.emit("error", {
            message: "Room not found",
          });

          return;
        }

        const participant = roomManager.addParticipant(
          roomId,
          socket.id,
          username
        );

        console.log(
          "PARTICIPANT ADDED:",
          participant
        );

        socket.join(roomId);
        socket.roomId = roomId;

        // Send current room state to new user
        socket.emit("sync_state", {
          room,
        });

        // Tell existing users about new participant
        socket.to(roomId).emit("user_joined", {
          userId: socket.id,
          username,
        });

        console.log(
          `User ${username} joined room ${roomId}`
        );
      } catch (error) {
        console.error("JOIN ROOM ERROR:", error);

        socket.emit("error", {
          message: "Failed to join room",
        });
      }
    });

    // ==========================================
    // PLAY
    // ==========================================

    socket.on("play", ({ currentTime }) => {
      const roomId = socket.roomId;

      if (!roomId) {
        return;
      }

      const room = roomManager.getRoom(roomId);

      if (!room) {
        return;
      }

      const participant = roomManager.getParticipant(
        roomId,
        socket.id
      );

      if (!participant) {
        return;
      }

      // Host and moderator can control playback
      if (
        participant.role !== "host" &&
        participant.role !== "moderator"
      ) {
        socket.emit("error", {
          message:
            "You don't have permission to play the video",
        });

        return;
      }

      roomManager.updatePlayback(
        roomId,
        "playing",
        currentTime
      );

      io.to(roomId).emit("play", {
        currentTime,
      });
    });

    // ==========================================
    // PAUSE
    // ==========================================

    socket.on("pause", ({ currentTime }) => {
      const roomId = socket.roomId;

      if (!roomId) {
        return;
      }

      const room = roomManager.getRoom(roomId);

      if (!room) {
        return;
      }

      const participant = roomManager.getParticipant(
        roomId,
        socket.id
      );

      if (!participant) {
        return;
      }

      // Host and moderator can control playback
      if (
        participant.role !== "host" &&
        participant.role !== "moderator"
      ) {
        socket.emit("error", {
          message:
            "You don't have permission to pause the video",
        });

        return;
      }

      roomManager.updatePlayback(
        roomId,
        "paused",
        currentTime
      );

      io.to(roomId).emit("pause", {
        currentTime,
      });
    });

    // ==========================================
    // SEEK
    // ==========================================

    socket.on("seek", ({ currentTime }) => {
      const roomId = socket.roomId;

      if (!roomId) {
        return;
      }

      const room = roomManager.getRoom(roomId);

      if (!room) {
        return;
      }

      const participant = roomManager.getParticipant(
        roomId,
        socket.id
      );

      if (!participant) {
        return;
      }

      // Host and moderator can seek
      if (
        participant.role !== "host" &&
        participant.role !== "moderator"
      ) {
        socket.emit("error", {
          message:
            "You don't have permission to seek",
        });

        return;
      }

      roomManager.updatePlayback(
        roomId,
        room.playbackState,
        currentTime
      );

      // IMPORTANT:
      // Send the same property name that
      // frontend expects.
      io.to(roomId).emit("seek", {
        currentTime,
      });
    });

    // ==========================================
    // CHANGE VIDEO
    // ==========================================

    socket.on("change_video", ({ videoId }) => {
      const roomId = socket.roomId;

      if (!roomId) {
        return;
      }

      const participant = roomManager.getParticipant(
        roomId,
        socket.id
      );

      if (!participant) {
        return;
      }

      // Host and moderator can change video
      if (
        participant.role !== "host" &&
        participant.role !== "moderator"
      ) {
        socket.emit("error", {
          message:
            "You don't have permission to change video",
        });

        return;
      }

      const room = roomManager.updateVideo(
        roomId,
        videoId
      );

      io.to(roomId).emit("change_video", {
        videoId,
        currentTime: 0,
        playbackState: "paused",
      });

      io.to(roomId).emit("sync_state", {
        room,
      });
    });

    // ==========================================
    // ASSIGN ROLE
    // ==========================================

    socket.on(
      "assign_role",
      ({ roomId, userId, role }) => {
        const currentUser =
          roomManager.getParticipant(
            roomId,
            socket.id
          );

        if (!currentUser) {
          socket.emit("error", {
            message: "You are not in this room",
          });

          return;
        }

        // Only host can assign roles
        if (currentUser.role !== "host") {
          socket.emit("error", {
            message:
              "Only host can assign roles",
          });

          return;
        }

        if (
          role !== "participant" &&
          role !== "moderator"
        ) {
          socket.emit("error", {
            message: "Invalid role",
          });

          return;
        }

        const participant =
          roomManager.updateRole(
            roomId,
            userId,
            role
          );

        if (!participant) {
          socket.emit("error", {
            message:
              "Participant not found",
          });

          return;
        }

        const room =
          roomManager.getRoom(roomId);

        io.to(roomId).emit(
          "role_assigned",
          {
            userId,
            username:
              participant.username,
            role,
            participants:
              room.participants,
          }
        );
      }
    );

    // ==========================================
    // REMOVE PARTICIPANT
    // ==========================================

    socket.on(
      "remove_participant",
      ({ userId }) => {
        const roomId = socket.roomId;

        if (!roomId) {
          return;
        }

        const currentUser =
          roomManager.getParticipant(
            roomId,
            socket.id
          );

        if (!currentUser) {
          return;
        }

        // Only host can remove participants
        if (currentUser.role !== "host") {
          socket.emit("error", {
            message:
              "Only host can remove participants",
          });

          return;
        }

        const removedParticipant =
          roomManager.removeParticipant(
            roomId,
            userId
          );

        if (!removedParticipant) {
          socket.emit("error", {
            message:
              "Participant not found",
          });

          return;
        }

        // Tell removed user
        io.to(userId).emit(
          "participant_removed",
          {
            userId,
            message:
              "You were removed from the room.",
          }
        );

        // Tell everyone else
        io.to(roomId).emit(
          "participant_removed",
          {
            userId,
            participants:
              roomManager.getRoom(roomId)
                ?.participants || [],
          }
        );

        // Remove socket from Socket.IO room
        const targetSocket =
          io.sockets.sockets.get(userId);

        if (targetSocket) {
          targetSocket.leave(roomId);
          targetSocket.roomId = null;
        }
      }
    );

    // ==========================================
    // CHAT
    // ==========================================

    socket.on(
      "send_message",
      ({ username, message }) => {
        try {
          const roomId = socket.roomId;

          // User must be inside a room
          if (!roomId) {
            socket.emit("error", {
              message:
                "You are not in a room",
            });

            return;
          }

          // Validate message
          if (
            !message ||
            !message.trim()
          ) {
            return;
          }

          const room =
            roomManager.getRoom(roomId);

          if (!room) {
            socket.emit("error", {
              message:
                "Room not found",
            });

            return;
          }

          const participant =
            roomManager.getParticipant(
              roomId,
              socket.id
            );

          if (!participant) {
            socket.emit("error", {
              message:
                "You are not a participant in this room",
            });

            return;
          }

          // Broadcast message to everyone
          // in the same room
          io.to(roomId).emit(
            "receive_message",
            {
              username:
                participant.username,
              message:
                message.trim(),
            }
          );

          console.log(
            `CHAT [${roomId}] ${participant.username}: ${message.trim()}`
          );
        } catch (error) {
          console.error(
            "CHAT ERROR:",
            error
          );

          socket.emit("error", {
            message:
              "Failed to send message",
          });
        }
      }
    );

    // ==========================================
    // LEAVE ROOM
    // ==========================================

    socket.on("leave_room", () => {
      const roomId = socket.roomId;

      if (!roomId) {
        return;
      }

      const participant =
        roomManager.getParticipant(
          roomId,
          socket.id
        );

      if (!participant) {
        return;
      }

      roomManager.removeParticipant(
        roomId,
        socket.id
      );

      socket.leave(roomId);

      socket.to(roomId).emit(
        "user_left",
        {
          userId: socket.id,
        }
      );

      socket.roomId = null;
    });

    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on("disconnect", () => {
      const roomId = socket.roomId;

      if (!roomId) {
        console.log(
          "User disconnected:",
          socket.id
        );

        return;
      }

      const room =
        roomManager.getRoom(roomId);

      if (!room) {
        return;
      }

      // If host disconnects,
      // close the room
      if (room.hostId === socket.id) {
        roomManager.deleteRoom(roomId);

        io.to(roomId).emit(
          "room_closed"
        );

        console.log(
          `Room ${roomId} closed because host disconnected`
        );

        return;
      }

      roomManager.removeParticipant(
        roomId,
        socket.id
      );

      socket.to(roomId).emit(
        "user_left",
        {
          userId: socket.id,
        }
      );

      console.log(
        `User ${socket.id} left room ${roomId}`
      );
    });
  });
}
