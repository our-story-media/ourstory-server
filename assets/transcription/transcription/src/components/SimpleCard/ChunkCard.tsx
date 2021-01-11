import { toShortTimeStamp } from "../../utils/chunkManipulation";
import { Chunk } from "../../utils/types";
import SimpleCard from "./SimpleCard";

const ChunkCard: React.FC<{ chunk: Chunk, duration: number }> = ({ chunk, children, duration }) => {
    return <SimpleCard title={`${toShortTimeStamp(chunk.starttimeseconds * duration)} - ${toShortTimeStamp(chunk.endtimeseconds * duration)}`}>{children}</SimpleCard>
}

export default ChunkCard;