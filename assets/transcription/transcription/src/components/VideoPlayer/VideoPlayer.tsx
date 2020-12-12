// External Dependencies
import React, { useRef } from "react";
import { Container, Button, Slider } from "@material-ui/core";
import ReactPlayer from "react-player";
import { PlayArrow, Pause } from "@material-ui/icons";

// Internal Dependencies
import useVideoPlayerProps from "./Hooks/useVideoPlayerProps";

// Styles
import useStyles from "./VideoPlayerStyles";

type VideoPlayerProps = {
  /** The url of the video */
  url: string;
  /** The beginning and end time points of the video to play as fractions */
  split?: { start: number; end: number };
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }: VideoPlayerProps) => {
  /* A reference to the ReactPlayer component. This is required to fetch the progression of the video */
  const playerRef = useRef<ReactPlayer>(null);

  /* The useVideoPlayerProps hook maintains the logic for this component */
  const [
    playerProps,
    progressBarProps,
    showControls,
    isPlaying,
    toggleIsPlaying,
  ] = useVideoPlayerProps(playerRef);

  const play_pause_button_icon = isPlaying ? (
    <Pause fontSize="large" />
  ) : (
    <PlayArrow fontSize="large" />
  );

  const classes = useStyles();

  return (
    <Container className={classes.videoPlayerContainer} maxWidth="xl">
      <ReactPlayer
        url={url}
        ref={playerRef}
        width="100%"
        height="100%"
        {...playerProps}
      />
      {showControls && (
        <>
          {/* Play/Pause Button */}
          <Button
            variant="contained"
            color="primary"
            className={classes.videoPlayerPlayButton}
            onClick={toggleIsPlaying}
          >
            {play_pause_button_icon}
          </Button>
          <div className={classes.progressBarContainer}>
            {/* Progress Bar */}
            <Slider classes={{colorPrimary: classes.progressBar}} {...progressBarProps} />
          </div>
        </>
      )}
    </Container>
  );
};

export default VideoPlayer;
