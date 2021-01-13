import { Link, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  indabaLink: {
    color: "#d9534f",
    cursor: "pointer",
  },
});

const IndabaLink: React.FC<any> = ({ ...props }) => {
  const classes = useStyles();
  return <Link className={classes.indabaLink} {...props} ></Link>;
};

export default IndabaLink;