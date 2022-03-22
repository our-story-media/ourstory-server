import { RefObject, useCallback, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { State } from "../../../utils/types";
import { ProgressState, VideoPlayerControllerType } from "../VideoPlayer";
import { SplitState } from "./useVideoPlayerState";

/**
 * This hook is used for when the user of the VideoPlayer component wants to
 * be able to externally control the state of the player. It provides the means
 * to read and write progress and playing states, read the duration state and
 * the controller object to be passed to the VideoPlayer component.
 * 
 * So basically, this hook gives a VideoPlayer's parent component the option
 * to get access and control to it's state
 */
const useVideoPlayerController = (autoPlay?: boolean): {
  /** The progress through the video */
  progressState: ProgressState;
  /** The state for whether the video is currently playin */
  playingState: State<boolean>;
  /**
   * State for for where the video is 'split'
   *
   * Callers of this hook can control the video such that only
   * a portion of it is presented to the user, as if that portion
   * was the entire video.
   * 
   * For example, if the split state is {start: 0, end: 0.5},
   * only the first half of the video will be presented to the user,
   * however, it will seem to the user that that is the entire video
   */
  splitState: State<SplitState>;
  /**
   * The duration of the video, fetched asynchronously from the ReactPlayer component,
   * so it's initially 0, and is set by this hook to the correct duration (in seconds)
   * when the video component initially loads
   */
  duration: number;
  /**
   * The controller itself, this should be passed to
   * the VideoPlayer component 'controller' prop
   */
  controller: VideoPlayerControllerType;
  /** 
   * A ReactPlayer ref, to be passed to
   * the VideoPlayer component 'playerRef' prop
   */
  playerRef: RefObject<ReactPlayer>;
} => {
  const playerRef = useRef<ReactPlayer>(null);

  const updatePlayerProgress = useCallback((newVal: number) => {
    const secondsLoaded = playerRef?.current?.getSecondsLoaded()
    secondsLoaded && secondsLoaded > 0 && playerRef.current?.seekTo(newVal, "fraction");
  }, []);

  const [progress, setProgress] = useState(0);

  const splitState = useState<SplitState>({ start: 0, end: 1 });

  const setProgressWithVideoUpdate = useCallback((
    progressSetter: number | ((prevProgress: number) => number)
  ) => {
    if (typeof progressSetter === "number") {
      setProgress(progressSetter);
      updatePlayerProgress(progressSetter);
    } else {
      setProgress((prevVal) => {
        const newVal = progressSetter(prevVal)
        updatePlayerProgress(newVal);
        return newVal;
      });
    }
  }, [updatePlayerProgress]);

  const [duration, setDuration] = useState(0);

  const playingState = useState(autoPlay ?? false);

  return {
    progressState: { progress, setProgress, setProgressWithVideoUpdate },
    splitState,
    playingState,
    duration,
    controller: {
      durationState: [duration, setDuration],
      playingState,
      splitState,
    },
    playerRef,
  };
};

export default useVideoPlayerController;
