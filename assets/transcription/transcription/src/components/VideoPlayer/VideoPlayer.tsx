// External Dependencies
import React, { useState } from 'react';
import { Container, Button } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { PlayArrow, Pause } from '@material-ui/icons';

// Styles
import useStyles from './VideoPlayerStyles';
import './VideoPlayer.css';

type VideoPlayerProps = {
  url: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const play_pause_button_icon = isPlaying ? <Pause/> : <PlayArrow/>;
  const classes = useStyles();

  return (
    <Container className={classes.videoPlayerContainer} maxWidth='xl'>
      <ReactPlayer
        className='react-player'
        url={url}
        playing={isPlaying}
        height={'100%'}
        width={'100%'}
      />
      <Button variant='contained' color='primary' className={classes.videoPlayerPlayButton} onClick={() => setIsPlaying(!isPlaying)}>
        {play_pause_button_icon}
      </Button>
    </Container>
  );
};

export default VideoPlayer;