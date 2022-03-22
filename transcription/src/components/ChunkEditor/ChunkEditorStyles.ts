import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    height: "50%",
    minHeight: "300px",
    maxWidth: "85%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "50%",
    },
  },
  videoPlayerContainer: {
    margin: "auto",
  },
  actionButton: {
    "&:hover": {
      background: "#d9534f",
    },
  },
  chunksList: {
    flexWrap: "nowrap",
    overflowX: "scroll",
    height: "100%",
    marginTop: "5px",
  },
  backButton: {
    background: "transparent",
    color: "black",
    fontSize: "16px",
  },
  backButtonContainer: {
    marginTop: "4px",
    padding: "0px",
  },
  onboardingTitle: {
    margin: 0,
  },
  chunkCardBody: {
    position: "relative",
  },
  newChunkButtonContainer: {
    position: "fixed",
    right: 0,
    bottom: 0,
    zIndex:-2
    // margin: "16px 16px 32px 16px",
    // display: "flex",
  },
}));

export default useStyles;
