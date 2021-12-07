// External Dependencies
import React from "react";
import { Box, Typography } from "@material-ui/core";
import LocalizedStrings from "react-localization";

// Internal Dependencies
import FlatPaper from "../FlatPaper/FlatPaper";
import FlatCard from "../FlatCard/FlatCard";
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import useStyles from "./StepInfoStyles";
import IndabaButton from "../IndabaButton/IndabaButton";

const strings = new LocalizedStrings({
  en: {
    perform: "Perform {0}",
  },
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
      <FlatCard
        className={classes}
        header={title}
        context={
          <Box style={{ marginTop: "8px" }}>
            <LinearProgressWithLabel value={progress} />
            <Typography style={{ padding: "6px" }}>{description}</Typography>
          </Box>
        }
        actions={
          <Box style={{ marginTop: "8px" }}>
            <IndabaButton disabled={!enabled} onClick={onSelect}>
              <Typography style={{ padding: "6px" }}>
                {strings.formatString(strings.perform, title)}
              </Typography>
            </IndabaButton>
          </Box>
        }
      />
    </div>
  );
};

export default StepInfo;
