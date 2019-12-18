import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden"
  },
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)"
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  }
};

function SingleLineGridList(props) {
  const { classes, chunks } = props;

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={3}>
        {chunks.map(chunk => (
          <GridListTile
            onClick={() => props.onPlay(chunk.startTime)}
            key={chunk.startTime}
          >
            <img src={chunk.img} alt={chunk.startTime} />
            <GridListTileBar
              title={
                timeFormatter(chunk.startTime) +
                " ~ " +
                timeFormatter(chunk.endTime)
              }
              classes={{
                root: classes.titleBar
              }}
              actionIcon={
                <IconButton aria-label={`star ${chunk.startTime}`}>
                  <CancelIcon
                    onClick={() =>
                      props.onDelete(chunk.startTime, chunk.endTime)
                    }
                  />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
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
