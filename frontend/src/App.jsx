import { useEffect, useState } from "react";
import Home from "./components/Home";
import WatchRoom from "./components/WatchRoom";
import socket from "./socket/socket";
import "./App.css";

function App() {
  const [room, setRoom] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [username, setUsername] = useState("");

  // ==========================================
  // SOCKET CONNECTION
  // ==========================================

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to server:", socket.id);
      setCurrentUserId(socket.id);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from server");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // ==========================================
  // CREATE ROOM
  // ==========================================

  const handleRoomCreated = ({
    username,
    videoId,
  }) => {
    setUsername(username);

    socket.emit("create_room", {
      username,
      videoId,
    });
  };

  // ==========================================
  // ROOM CREATED RESPONSE
  // ==========================================

  useEffect(() => {
    const handleRoomCreated = (data) => {
      console.log("ROOM CREATED:", data);

      setRoom(data.room);
      setCurrentUserId(socket.id);
    };

    socket.on(
      "room_created",
      handleRoomCreated
    );

    return () => {
      socket.off(
        "room_created",
        handleRoomCreated
      );
    };
  }, []);

  // ==========================================
  // JOIN ROOM
  // ==========================================

  const handleJoinRoom = ({
    username,
    roomId,
  }) => {
    setUsername(username);

    socket.emit("join_room", {
      roomId,
      username,
    });
  };

  // ==========================================
  // SYNC STATE
  // ==========================================

  useEffect(() => {
    const handleSyncState = ({ room }) => {
      console.log("SYNC STATE:", room);

      setRoom(room);
      setCurrentUserId(socket.id);
    };

    socket.on(
      "sync_state",
      handleSyncState
    );

    return () => {
      socket.off(
        "sync_state",
        handleSyncState
      );
    };
  }, []);

  // ==========================================
  // USER JOINED
  // ==========================================

  useEffect(() => {
    const handleUserJoined = ({
      userId,
      username,
    }) => {
      console.log(
        `${username} joined the room`
      );

      setRoom((previousRoom) => {
        if (!previousRoom) {
          return previousRoom;
        }

        const alreadyExists =
          previousRoom.participants.some(
            (participant) =>
              participant.userId === userId
          );

        if (alreadyExists) {
          return previousRoom;
        }

        return {
          ...previousRoom,
          participants: [
            ...previousRoom.participants,
            {
              userId,
              username,
              role: "participant",
            },
          ],
        };
      });
    };

    socket.on(
      "user_joined",
      handleUserJoined
    );

    return () => {
      socket.off(
        "user_joined",
        handleUserJoined
      );
    };
  }, []);

  // ==========================================
  // USER LEFT
  // ==========================================

  useEffect(() => {
    const handleUserLeft = ({ userId }) => {
      setRoom((previousRoom) => {
        if (!previousRoom) {
          return previousRoom;
        }

        return {
          ...previousRoom,
          participants:
            previousRoom.participants.filter(
              (participant) =>
                participant.userId !== userId
            ),
        };
      });
    };

    socket.on(
      "user_left",
      handleUserLeft
    );

    return () => {
      socket.off(
        "user_left",
        handleUserLeft
      );
    };
  }, []);

  // ==========================================
  // PLAY
  // ==========================================

  useEffect(() => {
    const handlePlay = ({ currentTime }) => {
      console.log(
        "PLAY received:",
        currentTime
      );

      setRoom((previousRoom) => {
        if (!previousRoom) {
          return previousRoom;
        }

        return {
          ...previousRoom,
          playbackState: "playing",
          currentTime,
        };
      });
    };

    socket.on("play", handlePlay);

    return () => {
      socket.off("play", handlePlay);
    };
  }, []);

  // ==========================================
  // PAUSE
  // ==========================================

  useEffect(() => {
    const handlePause = ({
      currentTime,
    }) => {
      console.log(
        "PAUSE received:",
        currentTime
      );

      setRoom((previousRoom) => {
        if (!previousRoom) {
          return previousRoom;
        }

        return {
          ...previousRoom,
          playbackState: "paused",
          currentTime,
        };
      });
    };

    socket.on("pause", handlePause);

    return () => {
      socket.off(
        "pause",
        handlePause
      );
    };
  }, []);

  // ==========================================
  // SEEK
  // ==========================================

  useEffect(() => {
    const handleSeek = ({
      currentTime,
    }) => {
      console.log(
        "SEEK received:",
        currentTime
      );

      setRoom((previousRoom) => {
        if (!previousRoom) {
          return previousRoom;
        }

        return {
          ...previousRoom,
          currentTime,
        };
      });
    };

    socket.on("seek", handleSeek);

    return () => {
      socket.off(
        "seek",
        handleSeek
      );
    };
  }, []);

  // ==========================================
  // CHANGE VIDEO
  // ==========================================

  useEffect(() => {
    const handleChangeVideo = ({
      videoId,
      currentTime,
      playbackState,
    }) => {
      console.log(
        "VIDEO CHANGED:",
        videoId
      );

      setRoom((previousRoom) => {
        if (!previousRoom) {
          return previousRoom;
        }

        return {
          ...previousRoom,
          videoId,
          currentTime:
            currentTime ?? 0,
          playbackState:
            playbackState ?? "paused",
        };
      });
    };

    socket.on(
      "change_video",
      handleChangeVideo
    );

    return () => {
      socket.off(
        "change_video",
        handleChangeVideo
      );
    };
  }, []);

  // ==========================================
  // ROLE ASSIGNED
  // ==========================================

  useEffect(() => {
    const handleRoleAssigned = ({
      userId,
      role,
      participants,
    }) => {
      console.log(
        "ROLE ASSIGNED:",
        userId,
        role
      );

      setRoom((previousRoom) => {
        if (!previousRoom) {
          return previousRoom;
        }

        // Backend sends the complete
        // participant list.
        if (participants) {
          return {
            ...previousRoom,
            participants,
          };
        }

        return {
          ...previousRoom,
          participants:
            previousRoom.participants.map(
              (participant) =>
                participant.userId === userId
                  ? {
                      ...participant,
                      role,
                    }
                  : participant
            ),
        };
      });
    };

    socket.on(
      "role_assigned",
      handleRoleAssigned
    );

    return () => {
      socket.off(
        "role_assigned",
        handleRoleAssigned
      );
    };
  }, []);

  // ==========================================
  // PARTICIPANT REMOVED
  // ==========================================

  useEffect(() => {
    const handleParticipantRemoved = ({
      userId,
      participants,
    }) => {
      console.log(
        "PARTICIPANT REMOVED:",
        userId
      );

      // If current user was removed
      if (userId === socket.id) {
        alert(
          "You were removed from the room."
        );

        setRoom(null);
        setUsername("");
        setCurrentUserId(null);

        return;
      }

      // Update remaining participants
      setRoom((previousRoom) => {
        if (!previousRoom) {
          return previousRoom;
        }

        if (participants) {
          return {
            ...previousRoom,
            participants,
          };
        }

        return {
          ...previousRoom,
          participants:
            previousRoom.participants.filter(
              (participant) =>
                participant.userId !== userId
            ),
        };
      });
    };

    socket.on(
      "participant_removed",
      handleParticipantRemoved
    );

    return () => {
      socket.off(
        "participant_removed",
        handleParticipantRemoved
      );
    };
  }, []);

  // ==========================================
  // ROOM CLOSED
  // ==========================================

  useEffect(() => {
    const handleRoomClosed = () => {
      alert(
        "The host has left. The room is closed."
      );

      setRoom(null);
      setUsername("");
      setCurrentUserId(null);
    };

    socket.on(
      "room_closed",
      handleRoomClosed
    );

    return () => {
      socket.off(
        "room_closed",
        handleRoomClosed
      );
    };
  }, []);

  // ==========================================
  // ERROR
  // ==========================================

  useEffect(() => {
    const handleError = ({ message }) => {
      console.error("SERVER ERROR:", message);
      alert(message);
    };

    socket.on("error", handleError);

    return () => {
      socket.off("error", handleError);
    };
  }, []);

  // ==========================================
  // PLAY ACTION
  // ==========================================

  const handlePlay = (currentTime) => {
    socket.emit("play", {
      currentTime,
    });
  };

  // ==========================================
  // PAUSE ACTION
  // ==========================================

  const handlePause = (currentTime) => {
    socket.emit("pause", {
      currentTime,
    });
  };

  // ==========================================
  // SEEK ACTION
  // ==========================================

  const handleSeek = (currentTime) => {
    socket.emit("seek", {
      currentTime,
    });
  };

  // ==========================================
  // CHANGE VIDEO
  // ==========================================

  const handleChangeVideo = (videoId) => {
    socket.emit("change_video", {
      videoId,
    });
  };

  // ==========================================
  // ASSIGN ROLE
  // ==========================================

  const handleAssignRole = (
    userId,
    role
  ) => {
    if (!room) {
      return;
    }

    socket.emit("assign_role", {
      roomId: room.roomId,
      userId,
      role,
    });
  };

  // ==========================================
  // REMOVE PARTICIPANT
  // ==========================================

  const handleRemoveParticipant = (
    userId
  ) => {
    socket.emit(
      "remove_participant",
      {
        userId,
      }
    );
  };

  // ==========================================
  // LEAVE ROOM
  // ==========================================

  const handleLeave = () => {
    socket.emit("leave_room");

    setRoom(null);
    setUsername("");
    setCurrentUserId(null);
  };

  // ==========================================
  // RENDER HOME
  // ==========================================

  if (!room) {
    return (
      <Home
        onRoomCreated={handleRoomCreated}
        onJoinRoom={handleJoinRoom}
      />
    );
  }

  // ==========================================
  // RENDER WATCH ROOM
  // ==========================================

  return (
    <WatchRoom
      room={room}
      currentUserId={currentUserId}
      username={username}
      onPlay={handlePlay}
      onPause={handlePause}
      onSeek={handleSeek}
      onChangeVideo={handleChangeVideo}
      onAssignRole={handleAssignRole}
      onRemoveParticipant={
        handleRemoveParticipant
      }
      onLeave={handleLeave}
    />
  );
}

export default App;