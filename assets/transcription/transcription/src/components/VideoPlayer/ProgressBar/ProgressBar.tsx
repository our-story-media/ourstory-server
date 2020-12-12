// External Dependencies
import { Slider } from "@material-ui/core";
import React from "react";

// Styles
import useStyles from "./ProgressBarStyles";

type ProgressBarProps = {
  /** The progress of the video, as a fraction */
  progress: number;
  /** Setter for the progress of the video */
  setProgress: (newVal: number) => void;
  /** Setter to tell parent that progress bar is being scrolled through */
  setDragging: (newVal: boolean) => void;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  setProgress,
  setDragging,
}: ProgressBarProps) => {
  const sliderProps = {
    value: progress,
    onChange: (_: any, newVal: number | number[]) => {
      setDragging(true);
      setProgress((newVal as number) / 100);
    },
    onChangeCommitted: () => {
      setDragging(false);
    },
  };

  return (
    <Slider {...sliderProps} />
  );
};

export default ProgressBar;
