import React, { Component } from "react";
import { Player, BigPlayButton, ControlBar, Shortcut } from "video-react";
import SingleLineGridList from "./lineGrid";
import PopupDialog from "./popupDialog";
import axios from "axios";
import { Button, Container } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Replay5 from "@material-ui/icons/Replay5";
import Snackbar from "@material-ui/core/Snackbar";
import ReactDOM from "react-dom";
import { ArrowBack } from "@material-ui/icons";

export default class VideoPlayer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      original: {
        transcription: {
          chunks: []
        }
      },
      source: props.src,
      open: false,
      options: ["Backward 2 Seconds", "Add New Breakpoint", "Discard Setting"],
      erroropen: false
    };
  }

  componentDidMount() {
    // Subscribe state change
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));

    this.serverRequest = axios.get("/api/watch/edit/" + this.props.id).then(
      function(result) {
        // var lastGist = result[0];
        // console.log(result);

        if (!result.data.transcription) {
          result.data.transcription = {
            chunks: []
          };
        }

        result.data.transcription.chunks.forEach(chunk => {
          chunk.starttime = toSecond(chunk.starttime);
          chunk.endtime = toSecond(chunk.endtime);
        });

        console.log(result.data);

        this.setState({
          original: result.data
        });
      }.bind(this)
    );
  }

  handleStateChange(state) {
    // Copy player state to this component's state
    this.setState({
      player: state
    });
  }

  saveEdit() {
    let newTranscription = Object.assign({}, this.state.original.transcription);
    let newChunks = [];

    const chunks = newTranscription.chunks;
    for (var i = 0; i < chunks.length; i++) {
      let newChunk = {};
      newChunk.starttime = toSrt({ ...chunks[i] }.starttime);
      newChunk.endtime = toSrt({ ...chunks[i] }.endtime);
      newChunk.creatorid = chunks[i].creatorid;
      newChunk.updatedat = new Date();
      newChunks.push(newChunk);
    }

    console.log("newchunks: ", newChunks);

    let tempstr = JSON.stringify(this.state.original);
    let temp = JSON.parse(tempstr);
    temp.transcription.chunks = newChunks;

    axios.post('/api/watch/savedit/' + this.props.id + '?apikey=' + this.props.apikey,  temp).then(function (result) {
      // Update last saved display
      console.log(result)
    });
  }

  handlePlay = starttime => {
    this.player.seek(starttime);
    this.player.play();
  };

  skipBack = () => {
    const { player } = this.player.getState();
    this.player.seek(player.currentTime - 2);
  };

  backButton = () => {
    window.history.back();
  };

  handleDelete = (starttime, endtime) => {
    // Remove the chunk selected
    let original = this.state.original;
    let originalchunks = original.transcription.chunks.filter(
      c => c.starttime !== starttime
    );

    // Replace the next chunk's start time with the start time of the chunk deleted
    let index = this.state.original.transcription.chunks.findIndex(
      c => c.starttime === endtime
    );
    if (index >= 1) originalchunks[--index].starttime = starttime;

    original.transcription.chunks = originalchunks;

    this.setState({ original });
    this.saveEdit();
  };

  handleClickOpen = () => {
    // this.player.pause();
    // this.setState({ open: true });

    this.handleConfirm();
  };

  handleClose = value => {
    this.setState({ open: false });
    switch (value) {
      case this.state.options[0]:
        const { player } = this.player.getState();
        this.player.seek(player.currentTime - 2);
        break;

      case this.state.options[1]:
        this.handleConfirm();
        break;

      default:
        break;
    }
  };

  handleConfirm() {
    // Record the thumbnail of the current endtime
    const { currentTime } = this.state.player;
    let original = Object.assign({}, this.state.original);

    console.log("Name to be saved: ", this.props.name)

    let newChunk = {
      endtime: currentTime,
      creatorid: this.props.name
    };

    // Get the index where the current time is larger than the start and smaller than the end
    let index = original.transcription.chunks.findIndex(
      c => currentTime >= c.starttime && currentTime <= c.endtime
    );

    if (currentTime == 0) {
      this.setState({
        erroropen: true
      });
      return;
    }

    if (index >= 1) {
      // Insert the new chunk into the middle of the list
      original.transcription.chunks[index].starttime = currentTime;
      newChunk.starttime = original.transcription.chunks[--index].endtime;
      original.transcription.chunks.splice(++index, 0, newChunk);
    } else if (index === 0) {
      // Insert the new chunk into the front of the list
      original.transcription.chunks[index].starttime = currentTime;
      newChunk.starttime = 0;
      original.transcription.chunks.splice(index, 0, newChunk);
    } else {
      // Insert the new chunk into the back of the list
      const c = original.transcription.chunks.slice(-1)[0];
      if (c) newChunk.starttime = c.endtime;
      else newChunk.starttime = 0;
      original.transcription.chunks.push(newChunk);
    }

    console.log("Original: ", original);

    this.setState({ original });
    this.saveEdit();
  }

  closeError = () => {
    this.setState({
      erroropen: false
    });
  };

  render() {
    return (
      <div>
        <br />
        <h2
          style={{
            position: "absolute",
            width: "15%",
            right: "1em",
            top: "3em"
          }}
        >
          Create a breakpoint when someone stops talking
        </h2>
        <Container style={{ maxWidth: "800px" }}>
          <Player
            ref={player => {
              this.player = player;
            }}
          >
            <source src={this.state.source} />
            <BigPlayButton position="center" />
            <Shortcut clickable={true} />
            <ControlBar autoHide={false} />
          </Player>
        </Container>
        <br />
        {/* <div className="py-3"> */}
        {/* <Button  className="m-2">
            Set Breakpoint
          </Button> */}

        <SingleLineGridList
          style={{ width: "100%" }}
          onPlay={this.handlePlay}
          onDelete={this.handleDelete}
          chunks={this.state.original.transcription.chunks}
        ></SingleLineGridList>

        <PopupDialog
          open={this.state.open}
          options={this.state.options}
          onClose={this.handleClose}
        />

        <div id="output"></div>
        {/* <div>{JSON.stringify(this.state.original)}</div> */}
        <Fab
          color="primary"
          onClick={this.skipBack}
          aria-label="left"
          style={{ position: "absolute", left: "2em", top: "45%" }}
        >
          <Replay5 />
        </Fab>
        <Fab
          color="primary"
          onClick={this.handleClickOpen}
          aria-label="add"
          style={{ position: "absolute", right: "1em", top: "45%" }}
        >
          <AddIcon />
        </Fab>
        <Button
          onClick={this.backButton}
          style={{ position: "absolute", left: "0", top: "1em" }}
        >
          <ArrowBack />
        </Button>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          open={this.state.erroropen}
          autoHideDuration={1000}
          onClose={this.closeError}
          message="Cannot add breakpoint here"
        ></Snackbar>
      </div>
      // </div>
    );
  }
}

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

function toSrt(duration) {
  console.log("duration: " + duration);
  let timestamp = duration * 1000;
  var milliseconds = parseInt((parseFloat(timestamp) % 1000) / 100),
    seconds = Math.floor((timestamp / 1000) % 60),
    minutes = Math.floor((timestamp / (1000 * 60)) % 60),
    hours = Math.floor((timestamp / (1000 * 60 * 60)) % 24);

    console.log(milliseconds)
  if (milliseconds < 10) milliseconds = "00" + milliseconds
  else milliseconds = "0" + milliseconds

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  console.log(hours + ":" + minutes + ":" + seconds + "," + milliseconds)

  return hours + ":" + minutes + ":" + seconds + "," + milliseconds;
}
