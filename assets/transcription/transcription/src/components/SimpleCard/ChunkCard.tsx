import { makeStyles } from "@material-ui/core";
import {
  getNameOf,
  secondsOf,
  toShortTimeStamp,
} from "../../utils/chunkManipulation";
import { Chunk } from "../../utils/types";
import SimpleCard from "./SimpleCard";
import { parseChunkTimeStamps } from "../../utils/chunkManipulation";
import React, { ReactNode } from "react";
import { Receipt } from "@material-ui/icons";

const useStyles = makeStyles({
  titleContainer: {
    fontSize: "1.2rem",
    position: "relative",
  },
});

const ChunkCard: React.FC<{
  chunk: Chunk;
  style?: any;
  transcriptionIcon?: ReactNode;
}> = ({ chunk, children, style, transcriptionIcon }) => {
  const classes = useStyles();
  const startEnd = parseChunkTimeStamps(chunk);

  const endSeconds = secondsOf(startEnd.end);
  const startSeconds = secondsOf(startEnd.start);

  return (
    <SimpleCard
      title={
        <div>
          {transcriptionIcon}
          <span className={classes.titleContainer}>
            <span style={{ fontWeight: 600 }}>{getNameOf(chunk)}</span>
            <br />
            {`${toShortTimeStamp(startSeconds)} - ${toShortTimeStamp(
              endSeconds
            )}`}
          </span>
        </div>
      }
      cardStyle={{ ...style, position: "relative", margin: "8px" }}
    >
      {children}
    </SimpleCard>
  );
};

export default ChunkCard;
