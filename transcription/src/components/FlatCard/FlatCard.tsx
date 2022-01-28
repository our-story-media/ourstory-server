import { Card, CardActions, CardContent, CardHeader } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { Classes } from "@material-ui/styles/mergeClasses/mergeClasses";
import React from "react";

const FlatCard: React.FC<{
  style?: CSSProperties;
  className: Classes;
  header: React.ReactNode;
  context: React.ReactNode;
  actions: React.ReactNode;
}> = React.forwardRef(({ className, header, context, actions, style }, ref) => {
  return (
    <Card ref={ref} elevation={0} style={style} className={className.card}>
      <CardHeader title={header} className={className.header}></CardHeader>
      <CardContent className={className.content}>{context} </CardContent>
      <CardActions
        style={{ justifyContent: "center" }}
        className={className.actions}
      >
        {actions}
      </CardActions>
    </Card>
  );
});

export default FlatCard;
