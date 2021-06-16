import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
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
    top: "50%",
    transform: "translateY(-50%)",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export default useStyles;
