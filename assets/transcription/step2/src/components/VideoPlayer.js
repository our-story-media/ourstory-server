import React from 'react';
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root:{
    position: 'relative',
    paddingTop: '56.25%',
    width: '100%',
    height: 0,

  },
  video:{
    position: 'absolute',
    top:0,
    left:0,
    bottom:0,
    right:0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
})

export default function VideoPlayer(props){
  const {time, src} = props;
  const videoRef = React.useRef(null);
  const classes = useStyles();

  React.useEffect(()=>{
    const seconds = toMS(time)/1000;
    if(seconds > 0){
      videoRef.current.currentTime = seconds
    }
  }, [time]);


  return (
    <Box className={classes.root}>
      <video className={classes.video} ref={videoRef} src={src} controls autoPlay={false}/>
    </Box>
  )
}


function toMS (timestamp) {
  if (!isNaN(timestamp)) {
    return timestamp
  }

  const match = timestamp.match(/^(?:(\d{2,}):)?(\d{2}):(\d{2})[,.](\d{3})$/)

  if (!match) {
    throw new Error('Invalid SRT or VTT time format: "' + timestamp + '"')
  }

  const hours = match[1] ? parseInt(match[1], 10) * 3600000 : 0
  const minutes = parseInt(match[2], 10) * 60000
  const seconds = parseInt(match[3], 10) * 1000
  const milliseconds = parseInt(match[4], 10)

  return hours + minutes + seconds + milliseconds
}
