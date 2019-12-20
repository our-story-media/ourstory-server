import React from 'react';
import {Card, CardHeader, CardContent, Typography, TextField} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme)=>createStyles({
  root: (props)=>({
    padding: theme.spacing(1),
    margin: theme.spacing(0,1),
    backgroundColor: props.focused ? "#f0f0f0" : '#FFF',
    minWidth: 480,
    cursor: "pointer",
  }),
  textArea:{
    width: '100%',
  }
}))

type ChunkItemProps = {
  chunk: Chunk,
  constribution: Object,
  focused: boolean,
  onClick: ()=>void,
  onUpdate: ()=>void,
}

export default function ChunkItem(props : ChunkItemProps){
  const { chunk, contribution, onClick, onUpdate, onActive } = props;
  const inputRef = React.useRef(null);
  const [content, setContent] = React.useState(props.content);
  const classes = useStyles(props);
  const {starttime, endtime} = chunk;
  const title = `${starttime} - ${endtime}`

  const handleSubmit = (e)=>{
    e.preventDefault();
    onUpdate(content);
  }

  const handleKeyPress = (e)=>{
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current.blur();
      onUpdate(content);
    }
  }

  return (
    <Card className={classes.root} onClick={()=>onActive()}>
      <CardHeader
        title={title}
        titleTypographyProps={{variant: 'h6'}}/>
      <CardContent>
        <form action="#" onSubmit={handleSubmit} onBlur={handleSubmit} >
          <TextField
            inputRef={inputRef}
            className={classes.textArea}
            label="Subtitle"
            multiline
            rows="3"
            placeholder="Please input your transcription"
            value={content}

            onKeyPress={handleKeyPress}
            onFocus={()=>onActive()}
            onChange={(e)=>setContent(e.target.value)}/>
        </form>

        {/* <textarea value={content} onChange={(e)=>setContent(e.target.value)}/> */}

        {/* <Typography gutterBottom>
          {contribution && contribution.text}
        </Typography> */}
      </CardContent>
    </Card>
  );
}
