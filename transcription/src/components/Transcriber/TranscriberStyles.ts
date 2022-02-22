import { makeStyles } from "@material-ui/core";

const chunkProgressHeight = "8px";

const useStyles = makeStyles(theme => ({
  videoPlayerContainer: {
    position: "relative",
    overflow: "hidden",
  },
  backButtonContainer: {
    marginTop: "4px",
    padding: "0px",
  },
  transcribeButton: {
    height: "300px",
    margin: "0px 6px 0px 6px",
    width: "70px",
  },
  videoContainer: {
    height: "40%",
    minHeight: "350px",
    maxWidth: "80%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "50%",
    },
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
    backgroundColor: "#FFFFFF",
    opacity: 0.8
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
  }));

export default useStyles;
