import { makeStyles } from "@material-ui/core";
import { getNameOf, secondsOf, toShortTimeStamp } from "../../utils/chunkManipulation";
import { Chunk } from "../../utils/types";
import SimpleCard from "./SimpleCard";
import { parseChunkTimeStamps } from "../../utils/chunkManipulation";

const useStyles = makeStyles({
  titleContainer: {
    fontSize: "1.2rem",
  },
});

const ChunkCard: React.FC<{ chunk: Chunk }> = ({ chunk, children }) => {
  const classes = useStyles();
  const startEnd = parseChunkTimeStamps(chunk);

  const endSeconds = secondsOf(startEnd.end);
  const startSeconds = secondsOf(startEnd.start);

  return (
    <SimpleCard
      title={
        <span className={classes.titleContainer}>
          <span style={{fontWeight: 600}}>{getNameOf(chunk)}</span>
          <br />
          {`${toShortTimeStamp(startSeconds)} - ${toShortTimeStamp(endSeconds)}`}
        </span>
      }
    >
      {children}
    </SimpleCard>
  );
};

export default ChunkCard;
