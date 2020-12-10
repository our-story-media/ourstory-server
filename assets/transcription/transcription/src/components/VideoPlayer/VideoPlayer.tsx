// External Dependencies
import React, { useState } from 'react';
import { Container, Button } from '@material-ui/core';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { PlayArrow, Pause } from '@material-ui/icons';

// Internal Dependencies
import useFadeControls from './Hooks/useFadeControls';
import ProgressBar from './ProgressBar/ProgressBar';

// Styles
import useStyles from './VideoPlayerStyles';

type VideoPlayerProps = {
  /** The url of the video */
  url: string
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }: VideoPlayerProps) => {
  /* State for whether the video is currently playing */
  const [isPlaying, setIsPlaying] = useState(false);
  /* State for the progress through the video, as a fraction */
  const [progress, setProgress] = useState(0);

  /* State for whether the play/pause button is visible */
  const [showControls, setShowControls]  = useFadeControls(isPlaying, 1500);

  const play_pause_button_icon = isPlaying ? <Pause fontSize='large'/> : <PlayArrow fontSize='large'/>;

  const classes = useStyles();

  const playerProps: ReactPlayerProps = {
    className: 'react-player',
    url: url,
    playing: isPlaying,
    height: '100%',
    width: '100%',
    progressInterval: 250,
    onProgress: ({ played, /*playedSeconds, loaded, loadedSeconds*/ }) => setProgress(played),
    onClick: () => setShowControls(state => !state),
  }

  return (
    <Container className={classes.videoPlayerContainer} maxWidth='xl'>
      <ReactPlayer {...playerProps}/>
      {
        showControls &&
        <>
          <Button variant='contained' color='primary' className={classes.videoPlayerPlayButton} onClick={() => setIsPlaying(state => !state)}>
            {play_pause_button_icon}
          </Button>
          <div className={classes.progressBarContainer}>
            <ProgressBar  progress={progress}/>
          </div>
        </>
      }
    </Container>
  );
};

export default VideoPlayer;