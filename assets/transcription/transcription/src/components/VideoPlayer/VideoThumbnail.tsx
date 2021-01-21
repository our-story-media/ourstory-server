import { useRef } from "react";
import ReactPlayer from "react-player";

type VideoThumbnailProps = {
  url: string;
  time: number;
};

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ url, time }) => {
  const playerRef = useRef<ReactPlayer>(null);

  return (
    <ReactPlayer
      url={url}
      width="100%"
      height="100%"
      playing={false}
      ref={playerRef}
      onReady={() => playerRef.current?.seekTo(time, "fraction")}
    />
  );
};

export default VideoThumbnail;
