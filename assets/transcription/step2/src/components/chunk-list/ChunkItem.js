import React from 'react';
import {Card, CardHeader, CardContent, Typography} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme)=>createStyles({
  root: (props)=>({
    padding: theme.spacing(1),
    margin: theme.spacing(0,1),
    backgroundColor: props.focused ? "#f0f0f0" : '#FFF',
    minWidth: 480,
    cursor: "pointer",
  }),
}))

type ChunkItemProps = {
  chunk: Chunk,
  constribution: Object,
  focused: boolean,
  onClick: ()=>void,
}

export default function ChunkItem(props : ChunkItemProps){
  const { chunk, contribution, onClick } = props;
  const classes = useStyles(props);
  const {starttime, endtime} = chunk;
  const title = `${starttime} - ${endtime}`
  return (
    <Card className={classes.root} onClick={onClick}>
      <CardHeader
        title={title}
        titleTypographyProps={{variant: 'h6'}}/>
      <CardContent>
        <Typography gutterBottom>
          {contribution && contribution.text}
        </Typography>
      </CardContent>
    </Card>
  );
}
