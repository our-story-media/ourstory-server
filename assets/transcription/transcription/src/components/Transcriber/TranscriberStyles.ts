import { makeStyles } from "@material-ui/core";

const chunkProgressHeight = "8px";

const useStyles = makeStyles({
  videoPlayerContainer: {
    position: "relative",
    overflow: "hidden",
  },
  inputField: {
    width: "100%",
  },
  chunkProgressRail: {
    height: chunkProgressHeight,
    color: "#d9534f",
  },
  chunkProgressTrack: {
    height: chunkProgressHeight,
    color: "#d9534f",
  },
  chunkProgressMark: {
    height: chunkProgressHeight,
    width: "4px",
  },
  stepperDots: {
    backgroundColor: "#d9534f",
  },
  stepperDotsContainer: {
    flexWrap: "wrap",
    // width: "90%"
  },
  stepperDot:{
    margin: "2px"
  }
  });

export default useStyles;
