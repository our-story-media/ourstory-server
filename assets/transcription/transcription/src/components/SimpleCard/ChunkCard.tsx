import { makeStyles } from "@material-ui/core";
import { toShortTimeStamp } from "../../utils/chunkManipulation";
import { Chunk } from "../../utils/types";
import SimpleCard from "./SimpleCard";
import { parseTimeStamps } from "../../utils/chunkManipulation";

const useStyles = makeStyles({
  titleContainer: {
    fontSize: "1.2rem",
  },
});

const ChunkCard: React.FC<{ chunk: Chunk; }> = ({
  chunk,
  children,
}) => {
  const classes = useStyles();
  const startEnd = parseTimeStamps(chunk);

  const startSeconds =
    startEnd.end.hours * 60 * 60 +
    startEnd.end.minutes * 60 +
    startEnd.end.seconds;

  const lengthSeconds =
    startSeconds -
    (startEnd.start.hours * 60 * 60 +
      startEnd.start.minutes * 60 +
      startEnd.start.seconds);

  return (
    <SimpleCard
      title={
        <span className={classes.titleContainer}>
          {`${lengthSeconds}
           second chunk starting at ${toShortTimeStamp(
             startSeconds
           )}`}
        </span>
      }
    >
      {children}
    </SimpleCard>
  );
};

export default ChunkCard;
