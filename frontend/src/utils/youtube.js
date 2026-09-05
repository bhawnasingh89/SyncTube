export function extractYouTubeVideoId(input) {
  if (!input) {
    return "";
  }

  const value = input.trim();

  // Already a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    // https://www.youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");

      if (videoId) {
        return videoId;
      }
    }

    // https://youtu.be/VIDEO_ID
    if (url.hostname === "youtu.be") {
      return url.pathname.substring(1);
    }

    // https://www.youtube.com/embed/VIDEO_ID
    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/embed/")[1];
    }
  } catch {
    return "";
  }

  return "";
}