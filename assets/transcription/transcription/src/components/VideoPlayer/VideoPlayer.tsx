import { Box, Button, Mark, SliderProps, Typography } from "@material-ui/core";
import { Forward5, Pause, PlayArrow, Replay5 } from "@material-ui/icons";
import React, { RefObject, useCallback } from "react";
import ReactPlayer from "react-player";
import useDefaultState from "../../hooks/useDefaultState";
import { toShortTimeStamp } from "../../utils/chunkManipulation";
import { State, StateSetter } from "../../utils/types";
import IndabaSlider from "../IndabaSlider/IndabaSlider";
import useVideoPlayerProps from "./Hooks/useVideoPlayerProps";
import { SplitState } from "./Hooks/useVideoPlayerState";
import ProgressBarLabel from "./ProgressBarLabel";
import useStyles from "./VideoPlayerStyles";

export type VideoPlayerControllerType = {
  /**
   * State for the duration of the video, in seconds.
   * 
   * This starts as zero and is updated when the video initially loads
   */
  durationState: State<number>;
  /** State for whether the video is currently playing */
  playingState: State<boolean>;
  /**
   * The caller of this function can choose to present only part of 
   * the source video to the end user, as if it was the whole video.
   * 
   * To do so, they set this state to be the start and end of the
   * partial video they want to show as fractions of the video.
   * 
   * For example: {start: 0, end: 0.5} would present the first
   * half of the source video to the user as if it were the entire
   * video
   */
  splitState: State<SplitState>;
};

export type ProgressState = {
  /** Progress through the video as a fraction */
  progress: number;
  /**
   * Update the progress without affecting the video player
   * 
   * This is what the player itself calls each time it progresses,
   * to inform the outside world of where it is in the video
   */
  setProgress: StateSetter<number>;
  /**
   * Update the progress in the video, including the player itself
   * 
   * This is what is called when the user scrobbles through the video-
   * it updates the internal state of the video player
   */
  setProgressWithVideoUpdate: StateSetter<number>;
};

export type VideoPlayerProps = {
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
   * A reference to the underlying player component. This is used to
   * subscribe to events such as onProgress
   */
  playerRef: RefObject<ReactPlayer>;
  /**
   * The external progress state (see type 'ProgressState' for details)
   */
  progressState: ProgressState;
  /**
   * Marks to put on the video scrobbler slider. This is used to
   * mark points of significance in the video, for example, the end
   * of a chunk
   */
  sliderMarks?: Mark[];
  /**
   * Optional callback for when the user scrolls through the video
   */
  onProgressDrag?: () => void;
  /** Optional override for slider component */
  slider?: React.ReactElement<SliderProps>;
  /** If set to true, the video will play again instantlye when it finishes */
  loop?: boolean;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  playerRef,
  controller,
  sliderMarks,
  progressState,
  onProgressDrag,
  slider,
  loop,
}) => {
  const classes = useStyles();
  const [duration, setDuration] = useDefaultState(controller?.durationState, 0);
  const { progress, setProgressWithVideoUpdate } = progressState;
  const playState = useDefaultState(controller?.playingState, false);
  const [split] = useDefaultState(controller?.splitState, {
    start: 0,
    end: 1,
  });

  const {
    playerProps,
    progressBarProps,
    showControls,
    isPlaying,
    toggleIsPlaying,
  } = useVideoPlayerProps(
    progressState,
    playState,
    playerRef,
    setDuration,
    split,
    onProgressDrag,
    loop
  );

  const sliderValueLabelFormat = useCallback(
    (progress: number) => toShortTimeStamp((progress / 100 - split.start) * duration),
    [duration, split.start]
  );

  return (
    <Box className={classes.videoPlayerContainer}>
      <ReactPlayer
        url={url}
        ref={playerRef}
        width="100%"
        height="100%"
        loop={loop}
        {...playerProps}
      />
      {showControls && (
        <div className={classes.videoControlsContainer}>
          <div style={{ position: "absolute", right: "240px", bottom: -4 }}>
            <Button
              disableRipple
              className={`${classes.videoPlayerButton} ${classes.roundButton}`}
              onClick={() =>
                duration &&
                setProgressWithVideoUpdate(
                  (progress) => progress - 5 / duration
                )
              }
            >
              <Replay5 fontSize="large" />
            </Button>
          </div>
          <Button
            disableRipple
            variant="contained"
            color="primary"
            className={classes.videoPlayerButton}
            onClick={toggleIsPlaying}
          >
            {(isPlaying && <Pause fontSize="large" />) || (
              <PlayArrow fontSize="large" />
            )}
          </Button>
          <div style={{ position: "absolute", left: "240px", bottom: -4 }}>
            <Button
              onClick={() =>
                duration &&
                setProgressWithVideoUpdate(
                  (progress) => progress + 5 / duration
                )
              }
              disableRipple
              className={`${classes.videoPlayerButton} ${classes.roundButton}`}
            >
              <Forward5 fontSize="large" />
            </Button>
          </div>
        </div>
      )}
      {slider || (
        <div className={classes.progressBarContainer}>
          {/* Progress Bar */}
          <Typography
            variant="caption"
            style={{ margin: "8px", color: "#FFFFFF" }}
          >
            {duration &&
              `${toShortTimeStamp(
                (progress - split.start) * duration
              )} / ${toShortTimeStamp((split.end - split.start) * duration)}`}
          </Typography>
          <IndabaSlider
            valueLabelDisplay="auto"
            valueLabelFormat={sliderValueLabelFormat}
            ValueLabelComponent={ProgressBarLabel}
            marks={sliderMarks ? sliderMarks : []}
            {...progressBarProps}
          />
        </div>
      )}
    </Box>
  );
};

export default VideoPlayer;
