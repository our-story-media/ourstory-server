import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  CardActions} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme)=>createStyles({
  root:{
    margin: theme.spacing(3,0),
  },
  editor:{
    width: "100%",
  }
}));

export default function ChunkEditor(props){
  const classes = useStyles();
  const { title, chunk, contrib } = props;
  const [data, setData] = React.useState(contrib);

  const updateField = (field, value)=>{
    setData({...data, [field]:value});
  }

  const handleSubmit = (e)=>{
    props.onSubmit(data);
  }

  const handleCancel = (e)=>{
    props.onCancel();
  }

  const {starttime, endtime} = chunk;
  const subheader = `${starttime} - ${endtime}`

  return (
    <Card className={classes.root}>
      <CardHeader
        title={title}
        titleTypographyProps={{variant: 'body1'}}
        subheader={subheader}/>

      <CardContent>
        <TextField
          className={classes.editor}
          label="Subtitle"
          multiline
          rows="2"
          value={data.text}
          onChange={(e)=>updateField('text', e.target.value)}
          variant="outlined"/>
      </CardContent>

      <CardActions>
        <Button
          onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary">
          Submit
        </Button>
      </CardActions>
    </Card>
  )
}
