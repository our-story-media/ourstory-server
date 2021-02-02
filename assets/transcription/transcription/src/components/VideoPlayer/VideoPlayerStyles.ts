import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  videoPlayerPlayButton: {
    position: "absolute",
    left: "50%",
    bottom: "50%",
    transform: "translate(-50%, 50%)",
    background: "linear-gradient(45deg, #FE6B8B 30%, #f54414 90%)",
  },
  videoPlayerContainer: {
    position: "relative",
    bottom: 0,
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
    height: 4
  },
  progressBarTrack: {
    height: 4
  },
  progressBarThumb: {
    height: 12,
    marginTop: -4
  },
  progressBarMark: {
    height: 10,
    marginTop: -3
  }
});

export default useStyles;
