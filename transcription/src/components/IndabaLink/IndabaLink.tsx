import { Link, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  indabaLink: {
    color: "#d9534f",
    cursor: "pointer",
  },
});

const IndabaLink: React.FC<any> = React.forwardRef(({ children, ...props }, ref) => {
  const classes = useStyles();
  return <Link ref={ref} className={classes.indabaLink} {...props} >{children}</Link>;
});

export default IndabaLink;