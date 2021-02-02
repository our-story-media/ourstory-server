import { State } from "../../../utils/types";

export type SplitState = {
  /** The start of the video split as a fraction */
  start: number;
  /** The end of the video split as a fraction */
  end: number;
}

export type VideoPlayerExternalState = {
  progressState: State<number>;
  playState: State<boolean>;
  durationState: State<number>;
  split: { start: number; end: number };
};

/*
Current Implementation:
------------------------------------------------------
onProgress() => updateState(fromPlayer)
useEffect(notFromPlayer ? updateVideoPlayer, [state]);
onScrobble() => updateState(notFromPlayer)

Planned Implementation:
------------------------------------------------------
onProgress = updateState();
onScrobble = updateStateAndVideo();
 */
