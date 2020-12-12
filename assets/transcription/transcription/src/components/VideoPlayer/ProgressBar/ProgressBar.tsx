// External Dependencies
import { Slider } from "@material-ui/core";
import React, { useRef, useState } from "react";
import Draggable, {
  DraggableData,
  DraggableEvent,
  DraggableProps,
} from "react-draggable";

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

  const changeHandler = (_: any, newVal: number|number[]) => {
    setDragging(true);
    setProgress((newVal as number) / 100);
  };

  const commitChangeHandler = () => {
    setDragging(false);
  };

  console.log(progress);

  return (
    <Slider
      value={progress}
      onChange={changeHandler}
      onChangeCommitted={commitChangeHandler}
    />
  );
};

export default ProgressBar;
