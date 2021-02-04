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
    height: chunkProgressHeight
  },
  chunkProgressTrack: {
    height: chunkProgressHeight
  },
  chunkProgressMark: {
    height: chunkProgressHeight,
    width: "4px"
  }
});

export default useStyles;
