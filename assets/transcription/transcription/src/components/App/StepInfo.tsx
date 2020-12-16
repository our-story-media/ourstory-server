// External Dependencies
import React from "react";
import { Typography, Button, } from "@material-ui/core";
import FlatPaper from "../FlatPaper/FlatPaper";

// Internal Dependencies
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import useStyles from "./StepInfoStyles";

type StepInfoProps = {
  title: string;
  description: string;
  progress: number;
};

const StepInfo: React.FC<StepInfoProps> = ({
  title,
  description,
  progress,
}) => {
  const classes = useStyles();
  return (
    <>
      <FlatPaper className={classes.stepHeader}>
        <Typography variant="subtitle1">{title}</Typography>
        <LinearProgressWithLabel value={progress} />
      </FlatPaper>
      <FlatPaper className={classes.paper}>
        {description}
        <br/>
        <Button variant="contained" className={classes.button} disableElevation>
          Perform {title}
        </Button>
      </FlatPaper>
    </>
  );
};

export default StepInfo;
