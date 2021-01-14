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
    padding: "20px",
  },
  progressBarContainer: {
    left: "0",
    bottom: "0",
    marginBottom: "-39px",
    transform: "translateY(calc(-100% - 16px))",
  },
  progressBar: {
    color: "#f54414",
  },
  rail: {
    padding: "0px",
    width: "98%",
    transform: "translateX(1%)"
  },
});

export default useStyles;
