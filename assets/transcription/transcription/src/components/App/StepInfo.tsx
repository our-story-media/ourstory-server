// External Dependencies
import React from "react";
import { Box, Typography } from "@material-ui/core";
import FlatPaper from "../FlatPaper/FlatPaper";

// Internal Dependencies
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import useStyles from "./StepInfoStyles";
import IndabaButton from "../IndabaButton/IndabaButton";

export type StepInfoProps = {
  title: string;
  description: string;
  progress: number;
  onSelect: () => void;
  enabled: boolean;
};

const StepInfo: React.FC<StepInfoProps> = ({
  title,
  description,
  progress,
  onSelect,
  enabled,
}) => {
  const classes = useStyles();
  return (
    <div>
      <FlatPaper className={classes.stepHeader}>
        <Typography variant="subtitle1">{title}</Typography>
        <LinearProgressWithLabel value={progress} />
      </FlatPaper>
      <FlatPaper className={classes.paper}>
        {description}
        <br />
        <Box style={{marginTop: "8px"}}>
          <IndabaButton disabled={!enabled} onClick={onSelect}>
            <Typography style={{ padding: "6px" }}>Perform {title}</Typography>
          </IndabaButton>
        </Box>
      </FlatPaper>
    </div>
  );
};

export default StepInfo;
