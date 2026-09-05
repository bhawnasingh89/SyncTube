import { useState } from "react";
import { extractYouTubeVideoId } from "../utils/youtube";

function Home({ onRoomCreated, onJoinRoom }) {
  const [username, setUsername] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleCreateRoom = () => {
    const name = username.trim();

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    const videoId = extractYouTubeVideoId(videoUrl);
                     
    if (videoUrl.trim() && !videoId) {
      alert("Please enter a valid YouTube URL or video ID.");
      return;
    }

    onRoomCreated({
      username: name,
      videoId,
    });
  };

  const handleJoinRoom = () => {
    const name = username.trim();
    const id = roomId.trim();

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    if (!id) {
      alert("Please enter a room ID.");
      return;
    }

    onJoinRoom({
      username: name,
      roomId: id,
    });
  };

  return (
    <main className="home-page">
      <div className="home-card">
        <div className="logo">
          <span>▶</span> SyncTube
        </div>

        <p className="subtitle">
          Watch YouTube together, in real time.
        </p>

        <div className="form-group">
          <label>Your name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="room-section">
          <h2>Create a room</h2>

          <div className="form-group">
            <label>YouTube video</label>

            <input
              type="text"
              placeholder="Paste YouTube URL or video ID"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          <button
            className="primary-button"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="room-section">
          <h2>Join a room</h2>

          <div className="form-group">
            <label>Room ID</label>

            <input
              type="text"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>

          <button
            className="secondary-button"
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    </main>
  );
}

export default Home;