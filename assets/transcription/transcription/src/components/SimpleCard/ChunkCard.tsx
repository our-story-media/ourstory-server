import { makeStyles } from "@material-ui/core";
import { toShortTimeStamp } from "../../utils/chunkManipulation";
import { Chunk } from "../../utils/types";
import SimpleCard from "./SimpleCard";

const useStyles = makeStyles({
    titleContainer: {
        fontSize: '1.2rem'
    }
})

const ChunkCard: React.FC<{ chunk: Chunk; duration: number }> = ({
  chunk,
  children,
  duration,
}) => {
    const classes = useStyles();
  return (
    <SimpleCard
      title={
        <span className={classes.titleContainer}>
          {`${Math.round(
            (chunk.endtimeseconds - chunk.starttimeseconds) * duration
          )}
           second chunk starting at ${toShortTimeStamp(
             chunk.starttimeseconds * duration
           )}`}
        </span>
      }
    >
      {children}
    </SimpleCard>
  );
};

export default ChunkCard;
