import { useDebounceCallback } from "@react-hook/debounce";
import { useCallback, useState } from "react";

const useAutoPauseOnType = (
  playing: boolean,
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
) => {
  /*
   * Here, we automatically pause the video when the user types.
   *
   * If the video was paused when the user starts typing, keep it
   * paused. Otherwise, play the video again once the user stops typing
   */
  const [, setTypingDebounced] = useState(false);
  const [
    playStateBeforeTypingDebounce,
    setPlayStateBeforeTypingDebounce,
  ] = useState(false);

  const debouncedPlay = useDebounceCallback(() => {
    setPlaying(playStateBeforeTypingDebounce);
    setTypingDebounced(false);
  }, 500);

  const onType = useCallback(() => {
    setTypingDebounced((typingDebounced) => {
      if (!typingDebounced) {
        setPlayStateBeforeTypingDebounce(playing);
      }
      return true;
    });
    debouncedPlay();
    setPlaying(false);
  }, [playing, setPlaying, debouncedPlay]);

  return onType;
};

export default useAutoPauseOnType;
