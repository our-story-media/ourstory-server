import { makeStyles } from "@material-ui/core";
import { secondsOf, toShortTimeStamp } from "../../utils/chunkManipulation";
import { Chunk } from "../../utils/types";
import SimpleCard from "./SimpleCard";
import { parseTimeStamps } from "../../utils/chunkManipulation";

const useStyles = makeStyles({
  titleContainer: {
    fontSize: "1.2rem",
  },
});

const ChunkCard: React.FC<{ chunk: Chunk }> = ({ chunk, children }) => {
  const classes = useStyles();
  const startEnd = parseTimeStamps(chunk);

  const endSeconds = secondsOf(startEnd.end);
  const startSeconds = secondsOf(startEnd.start);

  const lengthSeconds = endSeconds - startSeconds;

  return (
    <SimpleCard
      title={
        <span className={classes.titleContainer}>
          {`${lengthSeconds}
           second chunk starting at ${toShortTimeStamp(startSeconds)}`}
        </span>
      }
    >
      {children}
    </SimpleCard>
  );
};

export default ChunkCard;
