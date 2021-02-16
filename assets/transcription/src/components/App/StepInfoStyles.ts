import { makeStyles } from "@material-ui/core/styles";

const borderColor = "#dddddd";

const useStyles = makeStyles({
  paper: {
    border: `1px solid ${borderColor}`,
    borderTop: "0",
    borderTopRightRadius: "0",
    borderTopLeftRadius: "0",
    padding: "15px",
  },
  stepHeader: {
    padding: "4px",
    backgroundColor: "#f5f5f5",
    border: `1px solid ${borderColor}`,
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
  },
  button: {
      marginTop: "16px",
  },
});

export default useStyles;
