import { Button, Container, Slider, Typography } from "@material-ui/core";
import { Pause, PlayArrow } from "@material-ui/icons";
import React, { useRef, } from "react";
import ReactPlayer from "react-player";
import useDefaultState from "../../hooks/useDefaultState";
import { toShortTimeStamp } from "../../utils/chunkManipulation";
import { State } from "../../utils/types";
import useVideoPlayerProps from "./Hooks/useVideoPlayerProps";
import { ProgressState } from "./Hooks/useVideoPlayerState";
import useStyles from "./VideoPlayerStyles";

export type VideoPlayerControllerType = {progressState: State<ProgressState>, durationState: State<number>, playingState: State<boolean>}

type VideoPlayerProps = {
  /**
   * The user of the VideoPlayer component has the option to control the
   * player, to do so, they need to provide a controller object which has
   * the state the component requires
   */
  controller?: VideoPlayerControllerType;
  /**
   * The url of the video
   */
  url: string;
  /**
   * The user of the VideoPlayer component has the option to present to the
   * user a portion of the video as if it were the entire video. For example,
   * if split is set to {start: 0, end: 0.5}, only the first half of the video
   * will be presented to the end user.
   */
  split?: { start: number; end: number };
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  controller,
  split = { start: 0, end: 1 },
}) => {
  const classes = useStyles();
  const playerRef = useRef<ReactPlayer>(null);
  const [duration, setDuration] = useDefaultState(controller ? controller.durationState : null, 0);
  const [progress, setProgress] = useDefaultState(controller ? controller.progressState : null, { progress: 0, fromPlayer: false });
  const playState = useDefaultState(controller ? controller.playingState : null, false);
  
  const {
    playerProps,
    progressBarProps,
    showControls,
    isPlaying,
    toggleIsPlaying,
  } = useVideoPlayerProps(
    [progress, setProgress],
    playState,
    playerRef,
    setDuration,
    split
  );

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
            {(isPlaying && <Pause fontSize="large" />) || (
              <PlayArrow fontSize="large" />
            )}
          </Button>
          <div className={classes.progressBarContainer}>
            {/* Progress Bar */}
            <Typography
              variant="caption"
              style={{ margin: "8px", color: "#FFFFFF" }}
            >
              {duration &&
                `${toShortTimeStamp(
                  (progress.progress - split.start) * duration
                )} / ${toShortTimeStamp((split.end - split.start) * duration)}`}
            </Typography>
            <Slider
              classes={{
                colorPrimary: classes.progressBar,
                root: classes.rail,
              }}
              {...progressBarProps}
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default VideoPlayer;
