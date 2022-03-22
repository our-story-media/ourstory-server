import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    paddingBottom: "32px",
    height: "40vh",
    display: "flex",
    flexDirection: "column",
  },
  instructionsContainer: {
    flexGrow: 4,
  },
  divider: {
    marginBottom: "16px",
  },
  centerVertically: {
    position: "relative",
    top: "40%",
    transform: "translateY(-50%)",
    textAlign:'center'
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom:'-8px'
  },
  stepIcon: {
    fill: "#e53935",
  },
  stepText: {
    fill: "#ffffff",
  },
  stepCompleted: {
    fill: "#e53935"
  },
  stepLabel: {
    fontSize: "12px"
  }

}));

export default useStyles;
