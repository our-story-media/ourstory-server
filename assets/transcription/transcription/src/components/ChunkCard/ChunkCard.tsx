import { Button } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import { Chunk } from '../../utils/types';
import useStyles from './ChunkCardStyles';

type ChunkCardProps = {
    chunk: Chunk;
    onPlay: () => void;
};

const ChunkCard: React.FC<ChunkCardProps> = ({ chunk, onPlay }) => {

    const classes = useStyles();

    return (
        <div className={classes.cardContainer}>
            <span className={classes.timeStampContainer}>
               {chunk.starttimestamp} - {chunk.endtimestamp}
            </span>
            <Button onClick={onPlay}><PlayArrow/></Button>
        </div>
    );
}

export default ChunkCard;