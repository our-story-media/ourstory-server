import React, { Component } from "react";
import { Player, BigPlayButton, ControlBar, Shortcut } from "video-react";
import SingleLineGridList from "./lineGrid";
import PopupDialog from "./popupDialog";
import axios from 'axios';
import {Button,Container} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Replay5 from '@material-ui/icons/Replay5';
import Snackbar from '@material-ui/core/Snackbar';
import ReactDOM from 'react-dom'
import { ArrowBack } from "@material-ui/icons";

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
      erroropen: false
    };

    
  }

  componentDidMount() {
    // Subscribe state change
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));

      this.serverRequest = axios.get('/api/watch/edit/'+this.props.id).then(function (result) {
        // var lastGist = result[0];
        // console.log(result);

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

  skipBack = () => {
    const { player } = this.player.getState();
    this.player.seek(player.currentTime - 2);
  }

  backButton = () => {
    window.history.back();
  }

  handleDelete = (startTime, endTime) => {

    // Remove the chunk selected
    let original = this.state.original;
    let originalchunks = original.transcription.chunks.filter(c => c.startTime !== startTime);

    // Replace the next chunk's start time with the start time of the chunk deleted
    let index = this.state.original.transcription.chunks.findIndex(c => c.startTime === endTime);
    if (index >= 1) originalchunks[--index].startTime = startTime;

    // console.log(original)

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
    let original = this.state.original;

    let newChunk = {
      endTime: currentTime
    };

    // Get the index where the current time is larger than the start and smaller than the end
    let index = this.state.original.transcription.chunks.findIndex(
      c => currentTime >= c.startTime && currentTime <= c.endTime
    );

    if (currentTime == 0)
    {
      this.setState({
        erroropen: true
      });
      return;
    }

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

  closeError = ()=>{
    this.setState({
      erroropen: false
    });
  }

  render() {
    return (
      <div>
        <br />
        {/* <Card>
          <CardContent>
          
          </CardContent>
        </Card>
        <br /> */}
        <h2 style={{position:'absolute', width:'15%', right:'1em', top:'3em'}}>Create a breakpoint when someone stops talking</h2>
        <Container style={{maxWidth:'800px'}}>

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
          style={{width:'100%'}}
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
          <Fab color="primary" onClick={this.skipBack} aria-label="left" style={{position:'absolute', left:'2em', top:'45%'}}>
            <Replay5 />
          </Fab>
          <Fab color="primary" onClick={this.handleClickOpen} aria-label="add" style={{position:'absolute', right:'1em', top:'45%'}}>
            <AddIcon />
          </Fab>
          <Button onClick={this.backButton} style={{position:'absolute', left:'0', top:'1em'}}>
              <ArrowBack />
            </Button>
          <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
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
