import React, { Component, useRef, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import {Cancel,PlayArrow} from "@material-ui/icons";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {CardActionArea,CardActions, Button} from '@material-ui/core';

const styles = {
  root: {
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "space-around",
    overflow: "hidden"
  },
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)",
    spacing: 10
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  }
};

const scrollToRef = (ref) => ref.scrollLeft(ref.offsetLeft)  

function SingleLineGridList(props) {
  const { classes, chunks } = props;

  const myRef = useRef(null)
  // const executeScroll = () => scrollToRef(myRef)

  return (
    <div className={classes.root}>
      {/* <GridList className={classes.gridList} cols={3}> */}
      <div ref={myRef} style={{'overflowX':'auto', width:'100%','whiteSpace': 'nowrap'}}>
        {chunks.map(chunk => (
          // <GridListTile
            
            // key={chunk.startTime} >
          <Card onClick={() => props.onPlay(chunk.startTime)} style={{display:'inline-block',margin:'0.2em'}}>
            <CardActionArea>
            <CardContent>
              <h2 style={{'textAlign':'center'}}>
              {timeFormatter(chunk.startTime)} - {timeFormatter(chunk.endTime)}
              </h2>
            </CardContent>
            </CardActionArea>
            <CardActions disableSpacing={true}>
            <Button size="small" color="primary" onClick={() =>
                  props.onPlay(chunk.startTime)
                }>
              <PlayArrow />
                
                </Button>
            <Button size="small" color="primary" onClick={() =>
                  props.onDelete(chunk.startTime, chunk.endTime)
                }>
              <Cancel />
                
                </Button>
      </CardActions>
          </Card>
          // </GridListTile>

          // <GridListTile
          //   onClick={() => props.onPlay(chunk.startTime)}
          //   key={chunk.startTime} >
          //   <img src={chunk.img} alt={chunk.startTime} />

          //   {/* <VideoThumbnail
          //   crossorigin="anonymous"
          //   videoUrl="http://media.w3.org/2010/05/bunny/movie.mp4"
          //   thumbnailHandler={(thumbnail) => console.log(thumbnail)}
          //   snapshotAtTime={chunk.startTime}
          //   cors={true}
          //   width={120}
          //   height={80}
          //   /> */}

          //   <GridListTileBar
          //     title={
          //       timeFormatter(chunk.startTime) +
          //       " - " +
          //       timeFormatter(chunk.endTime)
          //     }
          //     classes={{
          //       root: classes.titleBar
          //     }}
          //     actionIcon={
          //       <IconButton aria-label={`star ${chunk.startTime}`} onClick={() =>
          //         props.onDelete(chunk.startTime, chunk.endTime)
          //       }>
          //         <CancelIcon
                    
          //         />
          //       </IconButton>
          //     }
          //   />
          // </GridListTile>
        ))}
        </div>
      {/* </GridList> */}
    </div>
  );
}

function timeFormatter(time) {
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;
  var result = "";
  result += "" + mins + ":" + (secs < 10 ? "0" : "");
  result += "" + secs;
  return result;
}

SingleLineGridList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SingleLineGridList);
