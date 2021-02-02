import { RefObject, useCallback, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { State } from "../../../utils/types";
import { ProgressState, VideoPlayerControllerType } from "../VideoPlayer";
import { SplitState } from "./useVideoPlayerState";

/**
 * This hook is used for when the user of the VideoPlayer component wants to
 * be able to externally control the state of the player. It provides the means
 * to read and write progress and playing states, read the duration state and
 * the controller object to be passed to the VideoPlayer component
 */
const useVideoPlayerController = (): {
  progressState: ProgressState;
  playingState: State<boolean>;
  splitState: State<SplitState>;
  duration: number;
  controller: VideoPlayerControllerType;
  playerRef: RefObject<ReactPlayer>;
} => {
  const playerRef = useRef<ReactPlayer>(null);

  const updatePlayerProgress = useCallback((newVal: number) => {
    playerRef?.current?.seekTo(newVal, "fraction");
  }, []);

  const [progress, setProgress] = useState(0);

  const splitState = useState<SplitState>({ start: 0, end: 1 });

  const setProgressWithVideoUpdate = (
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
  };

  const [duration, setDuration] = useState(0);

  const playingState = useState(false);

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
