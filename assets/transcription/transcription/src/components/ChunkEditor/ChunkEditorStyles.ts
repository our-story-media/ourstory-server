import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  videoPlayerContainer: {
    width: "90%",
    margin: "auto",
  },
  chunksContainer: {
    display: "flex",
    flexDirection: "row",
  },
  actionButton: {
    '&:hover': {
        background: "#d9534f",
     },
  }
});

export default useStyles;
