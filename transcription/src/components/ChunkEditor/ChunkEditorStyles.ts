import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
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
  },
  backButton: {
    background: "transparent",
    color: "black",
    fontSize: "16px",
  },
  backButtonContainer: {
    marginTop: "4px",
  },
  onboardingTitle: {
    margin: 0,
  },
  chunkCardBody: {
    marginTop: "8px",
    position: "relative",
  },
  newChunkButtonContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: "16px 16px 32px 16px",
    display: "flex",
  },
});

export default useStyles;
