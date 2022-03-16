import {
  Card,
  CardHeader,
  Avatar,
  CardActions,
  CardContent,
  CardMedia,
  Divider
} from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { Classes } from "@material-ui/styles/mergeClasses/mergeClasses";
import { api_base_address } from "../../utils/getApiKey";
import React from "react";

const FlatCard: React.FC<{
  style?: CSSProperties;
  className: Classes;
  context: React.ReactNode;
  actions: React.ReactNode;
  title: string;
}> = React.forwardRef(
  ({ className, context, actions, style, title }, ref) => {
    return (
      <Card ref={ref} elevation={0} style={style} className={className.card}>
        {/* <CardActionArea focusRipple={false}> */}
          <CardMedia
            className={className.card_image}
            image={`${api_base_address}/images/event_back.png`}
          >
            <div style={{color:'white', textAlign:'center', lineHeight:'130px',fontSize:'3em'}}>{title}</div>
            </CardMedia>
        {/* <CardHeader avatar={
          <Avatar>
            {title.substring(0,1)}
          </Avatar>
        }
        title={title}>
        </CardHeader> */}
          <CardContent className={className.content}>{context} </CardContent>
        {/* </CardActionArea> */}
        <Divider />
        <CardActions
          style={{ justifyContent: "center" }}
          className={className.actions}
        >
          {actions}
        </CardActions>
      </Card>
    );
  }
);

export default FlatCard;
