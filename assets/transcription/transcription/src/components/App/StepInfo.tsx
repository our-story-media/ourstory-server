// External Dependencies
import React from "react";
import { Typography, ThemeProvider, ButtonBase } from "@material-ui/core";
import FlatPaper from "../FlatPaper/FlatPaper";

// Internal Dependencies
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import useStyles from "./StepInfoStyles";
import theme from "../../styles/theme";

export type StepInfoProps = {
  title: string;
  description: string;
  progress: number;
  onSelect: () => void;
};

const StepInfo: React.FC<StepInfoProps> = ({
  title,
  description,
  progress,
  onSelect,
}) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <FlatPaper className={classes.stepHeader}>
        <Typography variant="subtitle1">{title}</Typography>
        <LinearProgressWithLabel value={progress} />
      </FlatPaper>
      <FlatPaper className={classes.paper}>
        {description}
        <br />
        <ButtonBase onClick={onSelect} className={classes.button}>
          <Typography style={{padding: "6px"}} variant="subtitle1">Perform {title}</Typography>
        </ButtonBase>
      </FlatPaper>
    </ThemeProvider>
  );
};

export default StepInfo;
