import { useEffect, useRef } from "react";
import YouTube from "react-youtube";

function VideoPlayer({
  videoId,
  playbackState,
  currentTime,
  canControl,
  onPlay,
  onPause,
  onSeek,
}) {
  const playerRef = useRef(null);

  const remoteActionRef = useRef(false);

  const handleReady = (event) => {
    playerRef.current = event.target;

    if (currentTime > 0) {
      event.target.seekTo(currentTime, true);
    }

    if (playbackState === "playing") {
      event.target.playVideo();
    }
  };

  const handleStateChange = (event) => {
    const player = event.target;

    // Ignore state changes caused by remote synchronization.
    if (remoteActionRef.current) {
      return;
    }

    if (!canControl) {
      return;
    }

    // PLAYING
    if (event.data === 1) {
      onPlay(player.getCurrentTime());
    }

    // PAUSED
    if (event.data === 2) {
      onPause(player.getCurrentTime());
    }
  };

  const handleSeek = () => {
    if (!canControl || !playerRef.current) {
      return;
    }

    onSeek(playerRef.current.getCurrentTime());
  };

  useEffect(() => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    remoteActionRef.current = true;

    const syncPlayer = async () => {
      try {
        if (typeof currentTime === "number") {
          player.seekTo(currentTime, true);
        }

        if (playbackState === "playing") {
          await player.playVideo();
        } else {
          player.pauseVideo();
        }
      } finally {
        setTimeout(() => {
          remoteActionRef.current = false;
        }, 300);
      }
    };

    syncPlayer();
  }, [playbackState, currentTime]);

  if (!videoId) {
    return (
      <div className="video-empty">
        <div className="video-empty-icon">▶</div>

        <h2>No video selected</h2>

        <p>
          The host can add a YouTube video from the room controls.
        </p>
      </div>
    );
  }

  return (
    <div className="video-wrapper">
      <YouTube
        videoId={videoId}
        onReady={handleReady}
        onStateChange={handleStateChange}
        onEnd={handleSeek}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
        }}
        className="youtube-player"
      />
    </div>
  );
}

export default VideoPlayer;