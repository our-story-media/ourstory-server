import { Card, CardContent, Divider, Typography } from "@material-ui/core";
import React, { ReactNode } from "react";

type SimpleCardProps = {
  title?: ReactNode;
  contentStyle?: any;
  cardStyle?: any;
};

const SimpleCard: React.FC<SimpleCardProps> = ({ title, children, contentStyle, cardStyle }) => {
  return (
    <Card variant="outlined" style={{...cardStyle}}>
      <CardContent style={{ ...contentStyle }}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {title ? <Divider style={{ margin: "4px 0 4px 0" }} /> : null}
        {children}
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
