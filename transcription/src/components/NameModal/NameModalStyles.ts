import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  modal: {
    outline: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContentBox: {
    padding: "16px",
  },
  input: {
    flex: 1,
    width: "400px",
    height: "3.5rem",
    border: "1px solid #cccccc",
    paddingLeft: "8px",
    borderRadius: "8px 9px 8px 8px",
  },
});

export default useStyles;
