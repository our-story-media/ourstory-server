import { useRef } from "react";
import ReactPlayer from "react-player";

type VideoThumbnailProps = {
  url: string;
  time: number;
};

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ url, time }) => {
  const playerRef = useRef<ReactPlayer>(null);
  // const [screenshot, setScreenshot] = useState<null | HTMLVideoElement >(null);

  // useEffect(() => {
  //   const video = document.createElement("video");
  //   video.crossOrigin = "anonymous";
  //   video.src = url;
  //   video.addEventListener("loadeddata", () => {
  //     video.currentTime = time;
  //     setScreenshot(video);
  //   });
  // }, []);

  // return screenshot ? (
  //   <div>{screenshot}</div>
  // ) : <div>Loading</div>
  return (
    <ReactPlayer
      crossOrigin="anonymous"
      url={url}
      width="100%"
      height="100%"
      playing={false}
      ref={playerRef}
      id={"video-thumbnail-player"}
      onReady={() => {
        playerRef.current?.seekTo(time, "fraction");
      }}
      
    />
  );
};

export default VideoThumbnail;
