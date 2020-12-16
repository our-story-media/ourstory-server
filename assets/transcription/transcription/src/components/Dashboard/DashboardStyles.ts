import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  gridListItem: {
    paddingLeft: "15px",
    paddingRight: "15px",
  },
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
    height: "3rem",
    border: "1px solid #cccccc",
    paddingLeft: "8px",
    borderRadius: "8px 0px 0px 8px",
  },
  button: {
    height: "3rem",
    borderRadius: "0px 8px 8px 0px",
  },
  introContainer: {
      textAlign: "center",
  },
  notMeLink: {
      color: "#d9534f",
      cursor: "pointer",
  }
});

export default useStyles;
