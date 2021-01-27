import { makeStyles } from "@material-ui/core";
import {
  getNameOf,
  secondsOf,
  toShortTimeStamp,
} from "../../utils/chunkManipulation";
import { Chunk } from "../../utils/types";
import SimpleCard from "./SimpleCard";
import { parseChunkTimeStamps } from "../../utils/chunkManipulation";
import React from "react";
import { Receipt } from "@material-ui/icons";

const useStyles = makeStyles({
  titleContainer: {
    fontSize: "1.2rem",
  },
});

const ChunkCard: React.FC<{ chunk: Chunk; style?: any }> = ({
  chunk,
  children,
  style,
}) => {
  const classes = useStyles();
  const startEnd = parseChunkTimeStamps(chunk);

  const endSeconds = secondsOf(startEnd.end);
  const startSeconds = secondsOf(startEnd.start);

  return (
    <SimpleCard
      title={
        <span className={classes.titleContainer}>
          {chunk.transcriptions.length !== 0 ? (
            <Receipt style={{ position: "absolute", top: 0, right: 0, margin: "8px" }} />
          ) : undefined}
          <br />
          <span style={{ fontWeight: 600 }}>{getNameOf(chunk)}</span>
          <br />
          {`${toShortTimeStamp(startSeconds)} - ${toShortTimeStamp(
            endSeconds
          )}`}
        </span>
      }
      style={style}
    >
      {children}
    </SimpleCard>
  );
};

export default ChunkCard;
