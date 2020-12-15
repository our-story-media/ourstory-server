import { Chunk } from '../../types';

type ChunkCardProps = {
    chunk: Chunk;
};

const ChunkCard: React.FC<ChunkCardProps> = ({ chunk }) => {

    return (
        <div>
            {chunk.starttimestamp} - {chunk.endtimestamp}
        </div>
    );
}

export default ChunkCard;