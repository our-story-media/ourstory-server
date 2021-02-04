import { Box, Button, Mark, SliderProps, Typography } from "@material-ui/core";
import { Pause, PlayArrow } from "@material-ui/icons";
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
  durationState: State<number>;
  playingState: State<boolean>;
  splitState: State<SplitState>;
};

export type ProgressState = {
  progress: number;
  setProgress: StateSetter<number>;
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
  playerRef: RefObject<ReactPlayer>;
  progressState: ProgressState;
  sliderMarks?: Mark[];
  onProgressDrag?: () => void;
  slider?: React.ReactElement<SliderProps>;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  playerRef,
  controller,
  sliderMarks,
  progressState,
  onProgressDrag,
  slider,
}) => {
  const classes = useStyles();
  const [duration, setDuration] = useDefaultState(
    controller?.durationState,
    0
  );
  const { progress } = progressState;
  const playState = useDefaultState(
    controller?.playingState,
    false
  );
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
    onProgressDrag
  );

  /* FIXME:
   * This doesn't currently consider the video split (need to add split.start)
   */
  const sliderValueLabelFormat = useCallback(
    (progress: number) => toShortTimeStamp((progress / 100) * duration),
    [duration]
  );

  return (
    <Box className={classes.videoPlayerContainer}>
      <ReactPlayer
        url={url}
        ref={playerRef}
        width="100%"
        height="100%"
        {...playerProps}
      />
      {showControls && (
        <Button
          disableRipple
          variant="contained"
          color="primary"
          className={classes.videoPlayerPlayButton}
          onClick={toggleIsPlaying}
        >
          {(isPlaying && <Pause fontSize="large" />) || (
            <PlayArrow fontSize="large" />
          )}
        </Button>
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
