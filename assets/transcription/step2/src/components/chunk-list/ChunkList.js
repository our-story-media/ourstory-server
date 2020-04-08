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
  return (
    <div className={classes.root}>
      {chunks.map((chunk, index)=>{
        const contributions = chunk.contributions || [];
        const contribId = contributions.findIndex(contribution=>contribution.user === user);
        const contribution = contribId < 0 ? null : chunk.contributions[contribId];
        const content = contribution ? contribution.text : "";
        return (
          <ChunkItem
            key={index}
            chunk={chunk}
            focused={activeIndex === index}
            content={content}
            onUpdate={(content)=>props.onUpdate({chunkId: index, contribId, content}) }
            onActive={()=>props.onSelect(index)}/>
        );
      })}
    </div>
  );
}
