import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  videoPlayerContainer: {
    position: "relative",
    overflow: "hidden",
  },
  inputField: {
    width: "100%",
  },
  chunkProgressRail: {
    height: "8px"
  },
  chunkProgressTrack: {
    height: "8px"
  }
});

export default useStyles;
