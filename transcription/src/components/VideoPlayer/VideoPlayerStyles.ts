import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  videoControlsContainer: {
    display: "flex",
    left: "50%",
    position: "absolute",
    bottom: "50%",
    transform: "translate(-50%, 50%)",
  },
  videoPlayerButton: {
    // background: "linear-gradient(45deg, #d9534f 40%, #d9534f 90%)",
    borderRadius:'8px'
  },
  videoControlsRewindButtonsContainer: {
    position: "absolute",
    bottom: -25,
    [theme.breakpoints.up("lg")]: {
      bottom: -10,
    },
  },
  videoControlsRewindButtonsContainerRight: {
    right: "180px",
    [theme.breakpoints.up("lg")]: {
      right: "130px",
    },
  },
  videoControlsRewindButtonsContainerLeft: {
    left: "180px",
    [theme.breakpoints.up("lg")]: {
      left: "130px",
    },
  },
  roundButton: {
    borderRadius: "50%",
    borderWidth:'4px',
    width: "128px",
    height: "128px",
    color: "white",
    display: "relative",
    [theme.breakpoints.up("lg")]: {
      borderRadius: "10px",
      width: "64px",
      height: "64px",
    },
  },
  videoPlayerContainer: {
    position: "relative",
    width:'100vw',
    // bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    // padding: "20px",
  },
  progressBarContainer: {
    left: "0",
    bottom: "0",
    marginBottom: "-39px",
    transform: "translateY(calc(-100% - 16px))",
    width: "100%",
  },
  progressBarColor: {
    color: "#f54414",
  },
  progressBarRoot: {
    padding: "0px",
    width: "96%",
    transform: "translateX(2%)",
    height: 4,
  },
  progressBarRail: {
    height: 4,
  },
  progressBarTrack: {
    height: 4,
  },
  progressBarThumb: {
    height: 12,
    marginTop: -4,
  },
  progressBarMark: {
    height: 10,
    marginTop: -3,
  },
}));

export default useStyles;
