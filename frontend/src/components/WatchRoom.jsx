import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import Participants from "./Participants";
import Chat from "./Chat";
import { extractYouTubeVideoId } from "../utils/youtube";

function WatchRoom({
  room,
  currentUserId,
  username,
  onPlay,
  onPause,
  onSeek,
  onChangeVideo,
  onAssignRole,
  onRemoveParticipant,
  onLeave,
}) {
  const [videoInput, setVideoInput] = useState("");

  const currentUser = room.participants.find(
    (participant) =>
      participant.userId === currentUserId
  );

  const role = currentUser?.role || "participant";

  const canControl =
    role === "host" || role === "moderator";

  const isHost = role === "host";

  const handleChangeVideo = () => {
    const videoId =
      extractYouTubeVideoId(videoInput);

    if (!videoId) {
      alert("Enter a valid YouTube URL or video ID.");
      return;
    }

    onChangeVideo(videoId);

    setVideoInput("");
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(
        room.roomId
      );

      alert("Room ID copied!");
    } catch {
      alert(`Room ID: ${room.roomId}`);
    }
  };

  return (
    <main className="watch-page">
      <header className="topbar">
        <div className="brand">
          <span>▶</span>
          SyncTube
        </div>

        <div className="room-info">
          <span>
            Room:
            <strong>{room.roomId}</strong>
          </span>

          <button onClick={copyRoomId}>
            Copy ID
          </button>
        </div>

        <button
          className="leave-button"
          onClick={onLeave}
        >
          Leave Room
        </button>
      </header>

      <div className="watch-layout">
        <section className="main-content">
          <div className="video-card">
            <VideoPlayer
              videoId={room.videoId}
              playbackState={room.playbackState}
              currentTime={room.currentTime}
              canControl={canControl}
              onPlay={onPlay}
              onPause={onPause}
              onSeek={onSeek}
            />
          </div>

          <div className="video-controls">
            <div className="control-heading">
              <div>
                <h2>Video Controls</h2>

                <p>
                  Your role:{" "}
                  <strong>{role}</strong>
                </p>
              </div>
            </div>

            {canControl && (
              <div className="video-control-row">
                <button
                  onClick={() => onPlay(0)}
                >
                  ▶ Play
                </button>

                <button
                  onClick={() => onPause(0)}
                >
                  ⏸ Pause
                </button>
              </div>
            )}

            {isHost && (
              <div className="change-video">
                <input
                  type="text"
                  placeholder="Paste YouTube URL or video ID"
                  value={videoInput}
                  onChange={(e) =>
                    setVideoInput(e.target.value)
                  }
                />

                <button
                  onClick={handleChangeVideo}
                >
                  Change Video
                </button>
              </div>
            )}

            {!canControl && (
              <div className="permission-note">
                You can watch the video, but only the
                Host or Moderator can control playback.
              </div>
            )}
          </div>
        </section>

        <aside className="sidebar">
          <Participants
            participants={room.participants}
            currentUserId={currentUserId}
            isHost={isHost}
            onAssignRole={onAssignRole}
            onRemove={onRemoveParticipant}
          />

          <Chat username={username} />
        </aside>
      </div>
    </main>
  );
} 

export default WatchRoom;