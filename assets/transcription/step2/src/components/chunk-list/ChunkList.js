import React from 'react';
import ChunkItem from './ChunkItem';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme)=>createStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
    padding: theme.spacing(2,1),
  }
}))

export default function ChunkList(props){
  const { user, chunks, activeIndex, onSelect } = props;
  const classes = useStyles(props);
  console.log(user);
  console.log(chunks);
  return (
    <div className={classes.root}>
      {chunks.map((chunk, index)=>{
        const contributions = chunk.contributions || [];
        const contribIndex = contributions.findIndex(contribution=>contribution.user === user);
        const contribution = contribIndex < 0 ? null : chunk.contributions[contribIndex]
        return (
          <ChunkItem
            key={index}
            chunk={chunk}
            focused={activeIndex === index}
            contribution={contribution}
            onClick={()=>onSelect({
              chunkId: index,
              contribId: contribIndex,
              contribution
            })}/>
        );
      })}
    </div>
  );
}
