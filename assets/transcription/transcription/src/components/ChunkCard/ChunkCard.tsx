import { Chunk } from '../../types';
import useStyles from './ChunkCardStyles';

type ChunkCardProps = {
    chunk: Chunk;
};

const ChunkCard: React.FC<ChunkCardProps> = ({ chunk }) => {

    const classes = useStyles();

    return (
        <div className={classes.cardContainer}>
            <span className={classes.timeStampContainer}>
               {chunk.starttimestamp} - {chunk.endtimestamp}
            </span>
        </div>
    );
}

export default ChunkCard;