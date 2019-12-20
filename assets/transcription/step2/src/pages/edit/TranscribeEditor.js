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

  const handleSelect = (selection)=>{
    const chunk = chunks[selection.chunkId];
    setStartTime(chunk.starttime);
    setFocus(selection.chunkId);
    setSelection(selection);
  }

  const updateChunk = (chunkId, chunkData)=>{
    onUpdate(chunks.map((chunk, index)=>(index === chunkId) ? {...chunk, ...chunkData} : chunk));
  }

  const handleCreateContrib = (contrib)=>{
    const {chunkId} = selection;
    const contributions = [...chunks[chunkId].contributions, contrib ];
    updateChunk(chunkId, {contributions})
    setSelection(null);
  }

  const handleUpdateContrib = (result)=>{
    const {chunkId, contribId} = selection;
    const contributions = chunks[chunkId].contributions.map((contribution,index)=>(index ===contribId ? result : contribution));
    updateChunk(chunkId, {contributions})
    setSelection(null);
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

      {selection && selection.contribution && (
        <Box marginTop={3}>
          <ContribEditor
            title="Edit Contribution"
            chunk={chunks[selection.chunkId]}
            contrib={selection.contribution}
            onCancel={()=>{setSelection(null)}}
            onSubmit={handleUpdateContrib}/>
        </Box>
      )}

      {selection && !selection.contribution && (
        <Box marginTop={3}>
          <ContribEditor
            title="Add Contribution"
            chunk={chunks[selection.chunkId]}
            contrib={{user, localeto:'en-AU'}}
            onCancel={()=>{setSelection(null)}}
            onSubmit={handleCreateContrib}/>
        </Box>
      )}

      <Box marginTop={3} style={{display: selection ? 'none' : 'block'}}>
        <ChunkList
          user={user}
          chunks={chunks}
          activeIndex={focus}
          onSelect={handleSelect}/>
      </Box>

    </Container>
  )
}
