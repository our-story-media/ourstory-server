import { State } from "../../../utils/types";

export type ProgressState = {
  /** The progress through the video as a fraction */
  progress: number;
  /** Whether the last progress change was due to the video being progressed by the
   *  ReactPlayer component
   */
  fromPlayer: boolean;
};

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
