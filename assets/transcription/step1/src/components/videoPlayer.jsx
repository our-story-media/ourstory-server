import React, { Component } from "react";
import { Player, BigPlayButton, ControlBar, Shortcut } from "video-react";
import { Button } from "reactstrap";
import SingleLineGridList from "./lineGrid";
import PopupDialog from "./popupDialog";
import axios from 'axios';

export default class VideoPlayer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      original: {
        transcription:{
          chunks:[]
        }
      },
      source: props.src,
      open: false,
      options: ["Backward 2 Seconds", "Add New Breakpoint", "Discard Setting"],
      
    };
  }

  componentDidMount() {
    // Subscribe state change
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));

      this.serverRequest = axios.get('/api/watch/edit/'+this.props.id).then(function (result) {
        // var lastGist = result[0];
        console.log(result);

        if (!result.data.transcription)
        {
          result.data.transcription = {
            chunks:[]
          }
        }

        this.setState({
          original: result.data
        });
      }.bind(this));
  }

  handleStateChange(state) {
    // Copy player state to this component's state
    this.setState({
      player: state
    });
  }

  saveEdit() {
    axios.post('/api/watch/savedit/' + this.props.id + '?apikey=' + this.props.apikey,  this.state.original).then(function (result) { 
      // Update last saved display
      console.log(result)
    });
  };

  handlePlay = startTime => {
    this.player.seek(startTime);
    this.player.play();
  };

  handleDelete = (startTime, endTime) => {
    // Remove the chunk selected
    let original = this.state.original.transcription.chunks.filter(c => c.startTime !== startTime);

    // Replace the next chunk's start time with the start time of the chunk deleted
    let index = this.state.original.transcription.chunks.findIndex(c => c.startTime === endTime);
    if (index >= 1) original.transcription.chunks[--index].startTime = startTime;

    this.setState({ original });
    this.saveEdit();
  };

  handleClickOpen = () => {
    this.player.pause();
    this.setState({ open: true });
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
    let original = this.state.original;

    let newChunk = {
      img: "/transcription/step1/build/static/images/grid-list/default.jpg",
      endTime: currentTime
    };

    // Get the index where the current time is larger than the start and smaller than the end
    let index = this.state.original.transcription.chunks.findIndex(
      c => currentTime >= c.startTime && currentTime <= c.endTime
    );

    if (index >= 1) {
      // Insert the new chunk into the middle of the list
      original.transcription.chunks[index].startTime = currentTime;
      newChunk.startTime = original.transcription.chunks[--index].endTime;
      original.transcription.chunks.splice(++index, 0, newChunk);
    } else if (index === 0) {
      // Insert the new chunk into the front of the list
      original.transcription.chunks[index].startTime = currentTime;
      newChunk.startTime = 0;
      original.transcription.chunks.splice(index, 0, newChunk);
    } else {
      // Insert the new chunk into the back of the list
      const c = original.transcription.chunks.slice(-1)[0];
      if (c) newChunk.startTime = c.endTime;
      else newChunk.startTime = 0;
      original.transcription.chunks.push(newChunk);
    }

    this.setState({ original });
    this.saveEdit();
  }

  render() {
    return (
      <div>
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

        <div className="py-3">
          <Button onClick={this.handleClickOpen} className="m-2">
            Set Breakpoint
          </Button>

          <SingleLineGridList
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
          <div>{JSON.stringify(this.state.original)}</div>
        </div>
      </div>
    );
  }
}
