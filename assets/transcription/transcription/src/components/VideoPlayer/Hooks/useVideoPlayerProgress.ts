
export type ProgressState = {
    /** The progress through the video as a fraction */
    progress: number,
    /** Whether the last progress change was due to the video being progressed by the
     *  ReactPlayer component
     */
    fromPlayer: boolean
  };
