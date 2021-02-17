// External Dependencies
import React from "react";
import { Box, Typography } from "@material-ui/core";
import LocalizedStrings from "react-localization";

// Internal Dependencies
import FlatPaper from "../FlatPaper/FlatPaper";
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import useStyles from "./StepInfoStyles";
import IndabaButton from "../IndabaButton/IndabaButton";

const strings = new LocalizedStrings({
  en: {
    perform: "Perform {0}"
  }
});

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
      <FlatPaper>
        <div className={classes.stepHeader}>
          <Typography variant="subtitle1">{title}</Typography>
          <LinearProgressWithLabel value={progress} />
        </div>
      </FlatPaper>
      <FlatPaper>
        <div className={classes.paper}>
          {description}
          <br />
          <Box style={{ marginTop: "8px" }}>
            <IndabaButton disabled={!enabled} onClick={onSelect}>
              <Typography style={{ padding: "6px" }}>
                {strings.formatString(strings.perform, title)}
              </Typography>
            </IndabaButton>
          </Box>
        </div>
      </FlatPaper>
    </div>
  );
};

export default StepInfo;
