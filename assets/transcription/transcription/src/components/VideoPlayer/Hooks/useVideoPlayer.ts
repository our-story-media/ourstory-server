// External Dependencies
import { useState, useEffect, RefObject } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";

// Internal Dependencies
import useToggle from "../../../hooks/useToggle";
import useFadeControls from "./useFadeControls";

/**
 * This hook maintains the logic for the VideoPlayer component.
 * 
 * It handles the logic for use intractions with the controls of the video,
 * and the automatic fading for when the video isn't interacted with
 * 
 * @param playerRef - a reference to the player that this hook controls
 */
const useVideoPlayer = (
  progressState: [progress: number, setProgress: (state: number) => void],
  playerRef: RefObject<ReactPlayer>,
  setDuration: (state: number) => void,
  /** The beginning and end of the clip of the video to play, as a fraction
   *  If, for example, start is 0 and end is 0.5, only play the first half of
   *  the video
   */
  split: { start: number, end: number },
): [ReactPlayerProps, any, boolean, boolean, () => void] => {
  /* State for whether the video is currently playing */
  const [isPlaying, toggleIsPlaying, setIsPlaying] = useToggle(false);

  /* State for whether the video source has been loaded */
  const [isLoaded, setIsLoaded] = useState(false);

  /* State for whether the user is scrolling through the video */
  const [dragging, setDragging] = useState(false);

  /* State for the progress through the video, as a fraction */
  const [progress, setProgress] = progressState;

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
  const playerProps: ReactPlayerProps = {
    playing:
      !dragging && /* Don't progress the player if the user is scrolling through the video */
      isPlaying,
    progressInterval: 250,
    onProgress: ({ played /*playedSeconds, loaded, loadedSeconds*/ }) =>
      setProgress(played),
    onClick: () => setShowControls((state) => !state),
    onReady: () => setIsLoaded(true),
    onEnded: () => setIsPlaying(false),
  };

  /* These are the props that will be passed onto the Slider component (the slider component is the video progress bar) */
  const progressBarProps = {
    value: progress * 100,
    min: split.start * 100,
    max: split.end * 100,
    step: 0.0001,
    onChange: (_: any, newVal: number | number[]) => {
      setDragging(true);
      setProgress((newVal as number) / 100);
    },
    onChangeCommitted: () => {
      setDragging(false);
    },
  };

  useEffect(() => {
    /** If the video is being dragged or is paused, keep it synced with the progress state
     */
    if (dragging || !isPlaying) {
      playerRef.current &&
        isLoaded &&
        playerRef.current.seekTo(progress, "fraction");
    }
  }, [progress, dragging, isPlaying, isLoaded, playerRef]);

  useEffect(() => {
    /** If the video is playing and it has reached the end, stop it from continuing */
    if (progress > split.end) {
      setProgress(split.end);
      setIsPlaying(false);
    /** If the video's progress is before the start of the split, set it to the start */
    } else if (progress < split.start) {
      setProgress(split.start);
    }
  }, [progress, setProgress, isPlaying, setIsPlaying, split.end, split.start]);

  return [
    playerProps,
    progressBarProps,
    showControls,
    isPlaying,
    toggleIsPlaying,
  ];
};

export default useVideoPlayer;
