import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Player, BigPlayButton, ControlBar, Shortcut } from "video-react";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

export default function VideoPopup(props) {
  const { videoClip, open } = props;
  let currentPlayer = null;

  if (videoClip.starttime && videoClip.endtime) {
    const startSecond = toSecond(videoClip.starttime);
    const endSecond = toSecond(videoClip.endtime);

    setInterval(() => {
      if (currentPlayer !== null) {
        currentPlayer.play();

        const { player } = currentPlayer.getState();
        const currentTime = player.currentTime;
        // console.log(currentTime);

        if (currentTime <= startSecond || currentTime >= endSecond)
          currentPlayer.seek(startSecond);
      }
    }, 200);
  }

  return (
    <div>
      <Dialog
        onClose={props.onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={props.onClose}>
          {"Video Segment " + videoClip.index + "/" + videoClip.size}
        </DialogTitle>

        <DialogContent dividers style={{ width: "600px", height: "400px" }}>
          <Player
            ref={player => {
              currentPlayer = player;
            }}
          >
            <source src={props.src} />
            <BigPlayButton position="center" />
            <Shortcut clickable={true} />
            <ControlBar autoHide={false} />
          </Player>
        </DialogContent>
      </Dialog>
    </div>
  );
}

VideoPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  videoClip: PropTypes.bool.isRequired
};

function toSecond(timestamp) {
  if (!isNaN(timestamp)) {
    return timestamp;
  }

  const match = timestamp.match(/^(?:(\d{2,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);

  if (!match) {
    throw new Error('Invalid SRT or VTT time format: "' + timestamp + '"');
  }

  const hours = match[1] ? parseInt(match[1], 10) * 3600000 : 0;
  const minutes = parseInt(match[2], 10) * 60000;
  const seconds = parseInt(match[3], 10) * 1000;
  const milliseconds = parseInt(match[4], 10);

  return (hours + minutes + seconds + milliseconds) / 1000;
}
