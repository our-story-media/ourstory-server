import { makeStyles } from "@material-ui/core/styles";

const borderColor = "#dddddd";

const useStyles = makeStyles({
  html: {
    fontFamily: "'Open Sans', 'Helvetica Neue', sans-serif",
  },
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
  card: {
    border: `1px solid ${borderColor}`,
    borderRadius: "6px",
    margin: "5px",
    marginBottom: "20px",
    minHeight: "320px",
  },
  header: {
    padding: "4px",
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
    fontFamily: "'Open Sans', 'Helvetica Neue', sans-serif",
  },
  card_image: {
    height: 140,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  button: {
    marginTop: "10px",
    fontSize: "1.1rem",
  },
});

export default useStyles;
