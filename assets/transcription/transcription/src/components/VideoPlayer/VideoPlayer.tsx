// External Dependencies
import React, { useRef, useState } from 'react';
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
  /* State for whether the user is scrolling through the video */
  const [dragging, setDragging] = useState(false)

  /* State for whether the video controls are visible */
  const [showControls, setShowControls]  = useFadeControls(!dragging && isPlaying, 2000);

  const play_pause_button_icon = isPlaying ? <Pause fontSize='large'/> : <PlayArrow fontSize='large'/>;

  const classes = useStyles();

  const playerRef = useRef<ReactPlayer>(null);

  const playerProps: ReactPlayerProps = {
    className: 'react-player',
    url: url,
    playing: !dragging && isPlaying, /* Don't progress the player if the user is scrolling through the video */
    height: '100%',
    width: '100%',
    progressInterval: 250,
    onProgress: ({ played, /*playedSeconds, loaded, loadedSeconds*/ }) => setProgress(played) ,
    onClick: () => setShowControls(state => !state),
  }

  return (
    <Container className={classes.videoPlayerContainer} maxWidth='xl'>
      <ReactPlayer ref={playerRef} {...playerProps}/>
      {
        showControls &&
        <>
          <Button variant='contained' color='primary' className={classes.videoPlayerPlayButton} onClick={() => setIsPlaying(state => !state)}>
            {play_pause_button_icon}
          </Button>
          <div className={classes.progressBarContainer}>
            <ProgressBar setDragging={setDragging}
                         onScroll = { offset => {
                           playerRef.current && playerRef.current.seekTo(offset, 'fraction');
                           playerRef.current && setProgress(playerRef.current.getCurrentTime() / playerRef.current.getDuration());
                         }}
                         progress={progress}/>
          </div>
        </>
      }
    </Container>
  );
};

export default VideoPlayer;