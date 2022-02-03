// External Dependencies
import React from "react";
import { Box, Typography } from "@material-ui/core";
import LocalizedStrings from "react-localization";

// Internal Dependencies
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
    <FlatCard
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        flexGrow: 1,
      }}
      className={classes}
      title={title}
      context={
        <Box style={{ marginTop: "8px" }}>
          <Typography
            variant="h5"
            style={{ fontFamily: "'Open Sans', 'Helvetica Neue', sans-serif" }}
          >
            {title}
          </Typography>
          <LinearProgressWithLabel value={progress} color="secondary" />
          <Typography style={{ padding: "6px", fontSize: "1.1rem" }}>
            {description}
          </Typography>
        </Box>
      }
      actions={
        <Box style={{ marginTop: "8px" }}>
          <IndabaButton disabled={!enabled} onClick={onSelect} style={{}}>
            <Typography style={{ padding: "6px", fontSize: "1.1rem" }}>
              {strings.formatString(strings.perform, title)}
            </Typography>
          </IndabaButton>
        </Box>
      }
    />
  );
};

export default StepInfo;
