import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  videoPlayerContainer: {
    margin: "auto",
    marginTop: "4vh",
    position: "relative",
  },
  transcribeControls: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  transcriptionInput: {
    flexGrow: 4,
  },
  inputField: {
    width: "100%",
  },
});

export default useStyles;
