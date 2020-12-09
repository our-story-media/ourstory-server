// External Dependencies
import React, { useState } from "react";
import { Button } from '@material-ui/core';
import ReactPlayer from "react-player";

// Styles
import "./VideoPlayer.css";

type VideoPlayerProps = {
  url: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <ReactPlayer
      url={url}
      playing={isPlaying}
      width={"100%"}
      height={"100%"}
    />
  );
};

export default VideoPlayer;