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
  card: {
    border: `1px solid ${borderColor}`,
    padding: "5px",
    margin: "5px",
    marginBottom: "20px",
    minHeight: "320px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    padding: "4px",
    borderBottom: `1px solid ${borderColor}`,
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
    backgroundColor: "#f5f5f5",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  actions: {
    borderTop: `1px solid ${borderColor}`,
  },
  button: {
    marginTop: "10px",
  },
});

export default useStyles;
