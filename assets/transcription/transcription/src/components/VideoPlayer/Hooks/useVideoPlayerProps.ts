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
const useVideoPlayerProps = (
  playerRef: RefObject<ReactPlayer>
): [ReactPlayerProps, any, boolean, boolean, () => void] => {
  /* State for whether the video is currently playing */
  const [isPlaying, toggleIsPlaying, setIsPlaying] = useToggle(false);

  /* State for whether the video source has been loaded */
  const [isLoaded, setIsLoaded] = useState(false);

  /* State for whether the user is scrolling through the video */
  const [dragging, setDragging] = useState(false);

  /* State for the progress through the video, as a fraction */
  const [progress, setProgress] = useState(0);

  /* The useFadecontrols hook maintains the state for whether the video controls should be shown */
  const [showControls, setShowControls] = useFadeControls(
    !dragging && isPlaying,
    2000
  );

  /* These are the props that will be passed onto the ReactPlayer component */
  const playerProps: ReactPlayerProps = {
    playing:
      !dragging /* Don't progress the player if the user is scrolling through the video */ &&
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
    onChange: (_: any, newVal: number | number[]) => {
      setDragging(true);
      setProgress((newVal as number) / 100);
    },
    onChangeCommitted: () => {
      setDragging(false);
    },
  };

  useEffect(() => {
    if (dragging || !isPlaying) {
      playerRef.current &&
        isLoaded &&
        playerRef.current.seekTo(progress, "fraction");
    }
  }, [progress, isLoaded, dragging, isPlaying, playerRef]);

  return [
    playerProps,
    progressBarProps,
    showControls,
    isPlaying,
    toggleIsPlaying,
  ];
};

export default useVideoPlayerProps;
