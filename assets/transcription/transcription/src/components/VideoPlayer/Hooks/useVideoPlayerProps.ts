// External Dependencies
import { useState, useEffect, RefObject, useMemo } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { StateSetter } from "../../../utils/types";

// Internal Dependencies
import useFadeControls from "./useFadeControls";
import { ProgressState } from "./useVideoPlayerState";

/**
 * This hook maintains the logic for the VideoPlayer component.
 *
 * It handles the logic for use intractions with the controls of the video,
 * and the automatic fading for when the video isn't interacted with
 *
 * @param playerRef - a reference to the player that this hook controls
 */
const useVideoPlayerProps = (
  progressStateIn: [
    progressState: ProgressState,
    setProgress: (state: ProgressState) => void
  ],
  playStateIn: [play: boolean, setPlay: StateSetter<boolean>],
  playerRef: RefObject<ReactPlayer>,
  setDuration: (state: number) => void,
  /** The beginning and end of the clip of the video to play, as a fraction
   *  If, for example, start is 0 and end is 0.5, only play the first half of
   *  the video
   */
  split: { start: number; end: number },
  onProgressDrag?: () => void,
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
  const [progressState, setProgressState] = progressStateIn;

  useEffect(() => {
    if (isLoaded && playerRef.current) {
      setDuration(playerRef.current.getDuration());
    }
  }, [setDuration, playerRef, isLoaded]);

  /* The useFadecontrols hook maintains the state for whether the video controls should be shown */
  const [showControls, setShowControls] = useFadeControls(
    !dragging && isPlaying,
    2000
  );

  /* These are the props that will be passed onto the ReactPlayer component */
  const playerProps: ReactPlayerProps = useMemo(
    () => ({
      playing: !dragging && isPlaying,
      progressInterval: 250,
      onProgress: ({ played /*playedSeconds, loaded, loadedSeconds*/ }) =>
        setProgressState({ progress: played, fromPlayer: true }),
      onClick: () => setShowControls((state) => !state),
      onReady: () => setIsLoaded(true),
      onEnded: () => setIsPlaying(false),
    }),
    [
      dragging,
      isPlaying,
      setShowControls,
      setIsLoaded,
      setIsPlaying,
      setProgressState,
    ]
  );

  /* These are the props that will be passed onto the Slider component (the slider component is the video progress bar) */
  const progressBarProps = useMemo(
    () => ({
      value: progressState.progress * 100,
      min: split.start * 100,
      max: split.end * 100,
      step: 0.0001,
      onChange: (_: any, newVal: number | number[]) => {
        onProgressDrag && onProgressDrag();
        setDragging(true);
        setProgressState({
          progress: (newVal as number) / 100,
          fromPlayer: false,
        });
      },
      onChangeCommitted: () => {
        setDragging(false);
      },
    }),
    [
      split.start,
      split.end,
      progressState.progress,
      setDragging,
      setProgressState,
      onProgressDrag,
    ]
  );

  useEffect(() => {
    /** If the change in state wasn't from the ReactPlayer component,
     *  we need to update the player ourselves
     */
    !progressState.fromPlayer &&
      playerRef.current &&
      isLoaded &&
      playerRef.current.seekTo(progressState.progress, "fraction");
  }, [progressState, dragging, isPlaying, isLoaded, playerRef]);

  useEffect(() => {
    /** If the video is playing and it has reached the end, stop it from continuing */
    if (progressState.progress > split.end) {
      setProgressState({ progress: split.end, fromPlayer: false });
      setIsPlaying(false);
      /** If the video's progress is before the start of the split, set it to the start */
    } else if (progressState.progress < split.start) {
      setProgressState({ progress: split.start, fromPlayer: false });
    }
  }, [
    progressState,
    setProgressState,
    isPlaying,
    setIsPlaying,
    split.end,
    split.start,
  ]);

  return {
    playerProps,
    progressBarProps,
    showControls,
    isPlaying,
    toggleIsPlaying: () => setIsPlaying((s) => !s),
  };
};

export default useVideoPlayerProps;
