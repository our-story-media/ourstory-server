import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  videoPlayerContainer: {
    width: "90%",
    margin: "auto",
  },
  actionButton: {
    '&:hover': {
        background: "#d9534f",
     },
  },
  chunksList: {
    flexWrap: "nowrap",
  }
});

export default useStyles;
