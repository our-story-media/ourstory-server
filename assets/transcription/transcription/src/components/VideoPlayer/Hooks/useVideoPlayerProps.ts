// External Dependencies
import { useState, useEffect, RefObject, useMemo } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { useThrottleCallback } from "@react-hook/throttle";

// Internal Dependencies
import { StateSetter } from "../../../utils/types";
import { ProgressState } from "../VideoPlayer";

const useProgressBarControls = (
  initialValue: number,
  playerUpdater: (newValue: number) => void
): {
  value: number;
  setWithoutVideoUpdate: (newValue: number) => void;
  setWithVideoUpdate: (newValue: number) => void;
} => {
  const [state, setState] = useState(initialValue);

  return {
    value: state,
    setWithoutVideoUpdate: (newValue: number) => {
      setState(newValue);
    },
    setWithVideoUpdate: (newValue: number) => {
      setState(newValue);
      playerUpdater(newValue);
    },
  };
};

/**
 * This hook maintains the logic for the VideoPlayer component.
 *
 * It handles the logic for use intractions with the controls of the video,
 * and the automatic fading for when the video isn't interacted with
 *
 * @param playerRef - a reference to the player that this hook controls
 */
const useVideoPlayerProps = (
  progressState: ProgressState,
  playStateIn: [play: boolean, setPlay: StateSetter<boolean>],
  playerRef: RefObject<ReactPlayer>,
  setDuration: (state: number) => void,
  /** The beginning and end of the clip of the video to play, as a fraction
   *  If, for example, start is 0 and end is 0.5, only play the first half of
   *  the video
   */
  split: { start: number; end: number },
  onProgressDrag?: () => void,
  loop?: boolean
): {
  playerProps: ReactPlayerProps;
  progressBarProps: any;
  showControls: boolean;
  isPlaying: boolean;
  toggleIsPlaying: () => void;
} => {
  const [isPlaying, setIsPlaying] = playStateIn;

  /* State for whether the video source has been loaded */
  const [isLoaded, setIsLoaded] = useState(false);

  /* State for whether the user is scrolling through the video */
  const [dragging, setDragging] = useState(false);

  /* State for the progress through the video, as a fraction */
  const { progress, setProgress, setProgressWithVideoUpdate } = progressState;

  useEffect(() => {
    if (isLoaded && playerRef.current) {
      setDuration(playerRef.current.getDuration());
    }
  }, [setDuration, playerRef, isLoaded]);

  /* The useFadecontrols hook maintains the state for whether the video controls should be shown */
  // const [showControls, setShowControls] = useFadeControls(
  //   !dragging && isPlaying,
  //   2000
  // );

  /* These are the props that will be passed onto the ReactPlayer component */
  const playerProps: ReactPlayerProps = useMemo(
    () => ({
      playing: !dragging && isPlaying,
      progressInterval: 250,
      onProgress: ({ played /*playedSeconds, loaded, loadedSeconds*/ }) =>
        setProgress(played),
      onReady: () => setIsLoaded(true),
      onEnded: () => setIsPlaying(false),
    }),
    [dragging, isPlaying]
  );

  const throttleUpdateVideo = useThrottleCallback(
    (newVal: number) => setProgressWithVideoUpdate(newVal / 100),
    10
  );

  const {
    value: progressBarValue,
    setWithVideoUpdate: onScrobble,
    setWithoutVideoUpdate: updateProgressBar,
  } = useProgressBarControls(progress * 100, throttleUpdateVideo);

  useEffect(() => {
    updateProgressBar(progress * 100);
  }, [progress]);

  /* These are the props that will be passed onto the Slider component (the slider component is the video progress bar) */
  const progressBarProps = useMemo(
    () => ({
      value: progressBarValue,
      min: split.start * 100,
      max: split.end * 100,
      step: 0.0001,
      onChange: (_: any, newVal: number | number[]) => {
        onProgressDrag && onProgressDrag();
        setDragging(true);
        onScrobble(newVal as number);
      },
      onChangeCommitted: (_: any, newVal: number | number[]) => {
        setProgressWithVideoUpdate((newVal as number) / 100);
        setDragging(false);
      },
    }),
    [progressBarValue, split]
  );

  useEffect(() => {
    /** If the video is playing and it has reached the end, stop it from continuing */
    if (progressState.progress > split.end) {
      if (loop) {
        setProgressWithVideoUpdate(split.start);
      } else {
        setProgressWithVideoUpdate(split.end);
        setIsPlaying(false);
      }
      /** If the video's progress is before the start of the split, set it to the start */
    } else if (progress < split.start) {
      setProgressWithVideoUpdate(split.start);
    }
  }, [progress, isPlaying, setIsPlaying, split.end, split.start]);

  return {
    playerProps,
    progressBarProps,
    showControls: true,
    isPlaying,
    toggleIsPlaying: () => setIsPlaying((s) => !s),
  };
};

export default useVideoPlayerProps;
