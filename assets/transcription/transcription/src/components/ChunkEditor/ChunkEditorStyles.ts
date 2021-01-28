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
});

export default useStyles;
