import { Button, Divider } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import { Chunk } from '../../utils/types';
import useStyles from './ChunkCardStyles';

type ChunkCardProps = {
    chunk: Chunk;
};

const ChunkCard: React.FC<ChunkCardProps> = ({ chunk, children }) => {

    const classes = useStyles();

    return (
        <div className={classes.cardContainer}>
            <span className={classes.timeStampContainer}>
               {chunk.starttimestamp} - {chunk.endtimestamp}
            </span>
            <Divider style={{ margin: "4px 0 4px 0" }}/>
            {children}
        </div>
    );
}

export default ChunkCard;