import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  buildVersion: {
    fontFamily: "Open Sans",
    color: "#7a7a7a",
    fontWeight: "bold",
    fontSize: "19px",
    position: "absolute",
    paddingTop: "10px",
    top: "-5px",
    left: "122px",
  },
  titleRow: {
    marginTop: "5px",
    display: "flex",
    flexDirection: "row",
    height: "36px",
  },
  logoContainer: {
    position: "relative",
    width: "25%",
  },
  titleContainer: {
    width: "50%",
    height: "30px",
    paddingLeft: "15px",
    paddingRight: "15px",
    textAlign: "center",
  },
  titleWrapper: {
    fontSize: "13pt",
    margin: "3px",
    display: "inline-block",
  },
});

export default useStyles;
