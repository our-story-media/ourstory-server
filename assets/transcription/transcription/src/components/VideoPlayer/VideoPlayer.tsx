// External Dependencies
import React, { MutableRefObject, useRef } from "react";
import { Container, Button, Slider } from "@material-ui/core";
import ReactPlayer from "react-player";
import { PlayArrow, Pause } from "@material-ui/icons";

// Internal Dependencies
import useVideoPlayer from "./Hooks/useVideoPlayer";

// Styles
import useStyles from "./VideoPlayerStyles";

type VideoPlayerProps = {
  /** The url of the video */
  url: string;
  /** The VideoPlayer component will inform it's parent of it's current progress
   *  into the video through this mutable reference.
   *  The VideoPlayer guarantees that the value of this reference will always be
   * the current progress through the video as a fraction.
   * 
   * NOTE - This value is a fraction of the entire video. So, even if the parent
   * has requested to play only half of the video, when that half has finished
   * playing, the reference will equal 0.5 (as only half of the video was played)
   */
  progress: [progress: number, setProgress: (state: number) => void]
  /** Once the video has initially loaded, the component will write the duration
   *  of the video in seconds to this state
   */
  setDuration: (state: number) => void;
  /** The beginning and end time points of the video to play as fractions */
  split?: { start: number; end: number };
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, progress, setDuration, split = { start: 0, end: 1} }: VideoPlayerProps) => {
  /* A reference to the ReactPlayer component. This is required to fetch the progression of the video */
  const playerRef = useRef<ReactPlayer>(null);

  /* The useVideoPlayerProps hook maintains the logic for this component */
  const [
    playerProps,
    progressBarProps,
    showControls,
    isPlaying,
    toggleIsPlaying,
  ] = useVideoPlayer(progress, playerRef, setDuration, split);

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
            <Slider classes={{colorPrimary: classes.progressBar, root: classes.rail}} {...progressBarProps} />
          </div>
        </>
      )}
    </Container>
  );
};

export default VideoPlayer;
