import { Card, CardContent, Divider, Typography } from "@material-ui/core";
import React, { ReactNode } from "react";

type SimpleCardProps = {
  title?: ReactNode;
  contentStyle?: any;
  cardStyle?: any;
};

const SimpleCard: React.FC<SimpleCardProps> = ({
  title,
  children,
  contentStyle,
  cardStyle,
}) => {
  return (
    <Card  style={{ ...cardStyle }} variant="outlined">
      <CardContent style={{ ...contentStyle }}>
        {children}
        <Typography variant="subtitle1" component="div" >
          {title}
        </Typography>
      </CardContent>
    </Card>
    // <div className={classes.cardContainer} style={style}>
    //     <span>
    //        {title}
    //     </span>
    //     <Divider style={{ margin: "4px 0 4px 0" }}/>
    //     {children}
    // </div>
  );
};

export default SimpleCard;
