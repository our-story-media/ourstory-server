import React from 'react';
import {Box, Container, Grid, Paper} from '@material-ui/core'
import VideoPlayer from 'components/VideoPlayer';
import ChunkList from 'components/chunk-list';
import ContribEditor from 'components/contrib-editor';
import { makeStyles, createStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme: Theme)=>createStyles({
  box:{
    maxHeight: 600,
    overflow: 'auto'
  }
}))


export default function TranscribeEditor(props){
  const { src, user, chunks, onUpdate} = props;
  const classes = useStyles();
  const [ selection, setSelection ] = React.useState(null);
  const [ startTime, setStartTime] = React.useState(0);
  const [ focus, setFocus] = React.useState(null);

  const handleSelect = (chunkId)=>{
    const chunk = chunks[chunkId];
    setFocus(chunkId);
    setStartTime(chunk.starttime);
  }

  const handleUpdate = ({chunkId, contribId, content})=>{
    const contributions = contribId < 0 ?
      [...chunks[chunkId].contributions || [], {user, text:content}] :
      chunks[chunkId].contributions.map((contribution,index)=>(index ===contribId ? {...contribution, text:content} : contribution));
    const nextChunks = chunks.map((chunk, index)=>(index === chunkId) ? {...chunk, contributions} : chunk)
    onUpdate(nextChunks);
  }


  return (
    <Container fixed>
      <Box marginTop={3}>
        <Paper>
          <Grid container spacing={4}>
            <Grid item xs={3}/>
            <Grid item xs={6}>
              <Box className={classes.box}>
                <VideoPlayer time={startTime} src={src} />
              </Box>
            </Grid>
            <Grid item xs={3}/>
          </Grid>
        </Paper>
      </Box>

      <Box marginTop={3}>
        <ChunkList
          user={user}
          chunks={chunks}
          activeIndex={focus}
          onUpdate={handleUpdate}
          onSelect={handleSelect}/>
      </Box>

    </Container>
  )
}
