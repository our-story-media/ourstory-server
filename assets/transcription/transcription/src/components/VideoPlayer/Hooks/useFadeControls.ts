import React, { useState, useEffect, SetStateAction } from 'react';

/**
 * This hook provides state for whether the videos play/pause button should be
 * shown, as well as the setter for that state. The purpose of this hook is to
 * provide automatic fading for the play/pause button when the video is playing
 * 
 * The behaviour is: if the video is playing and the play/pause button is
 * shown, hide the button after 'timeUntilFade' milliseconds. If the video is
 * paused, don't fade the button
 * 
 * @param {boolean} doFade - state for whether the controls should be faded or not
 * @param {number} timeUntilFade - the number of seconds from when the video
 * is playing and the play/pause button is shown until the play/pause button is
 * faded.
 */
const useFadeControls = (
  doFade: boolean,
  timeUntilFade: number = 1000
): [boolean, React.Dispatch<SetStateAction<boolean>>] => {
  const [showControls, setShowControls] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    /* When the play/pause button is shown and the video is playing, 
     * we want to set a timeout, afterwhich, we want to hide the
     * play/pause button
     */ 
    if (showControls && doFade) {
      setTimeoutId(
        setTimeout(() => setShowControls(false), timeUntilFade)
      );
    /* If the play/pause button is shown and the video isn't playing,
     * we want to cancel the timeout (this is the case where the
     * video has been paused)
     */
    } else if (showControls && !doFade && timeoutId) {
      clearTimeout(timeoutId);
    }
    return () => timeoutId && clearTimeout(timeoutId);
  }, [showControls, doFade]);

  return [showControls, setShowControls];
};

export default useFadeControls;
