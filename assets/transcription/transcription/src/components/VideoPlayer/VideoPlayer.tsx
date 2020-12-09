// External Dependencies
import React, { useState } from 'react';
import { Container, Button } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { PlayArrow, Pause } from '@material-ui/icons';

// Internal Dependencies
import useFadePlayPauseButton from './Hooks/useFadePlayPauseButton';

// Styles
import useStyles from './VideoPlayerStyles';
import './VideoPlayer.css';

type VideoPlayerProps = {
  url: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }: VideoPlayerProps) => {
  /* State for whether the video is currently playing */
  const [isPlaying, setIsPlaying] = useState(false);
  /* State for whether the play/pause button is visible */
  const [showPlayPauseButton, setShowPlayPauseButton]  = useFadePlayPauseButton(isPlaying, 1500);

  const play_pause_button_icon = isPlaying ? <Pause fontSize='large'/> : <PlayArrow fontSize='large'/>;

  const classes = useStyles();

  return (
    <Container className={classes.videoPlayerContainer} maxWidth='xl'>
      <ReactPlayer
        className='react-player'
        url={url}
        playing={isPlaying}
        height={'100%'}
        width={'100%'}
        onClick={()=>setShowPlayPauseButton(state => !state)}
      />
      {
        showPlayPauseButton &&
        <Button variant='contained' color='primary' className={classes.videoPlayerPlayButton} onClick={() => setIsPlaying(state => !state)}>
          {play_pause_button_icon}
        </Button>
      }
    </Container>
  );
};

export default VideoPlayer;