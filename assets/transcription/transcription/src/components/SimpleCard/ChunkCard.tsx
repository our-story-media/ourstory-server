import { Chunk } from "../../utils/types";
import SimpleCard from "./SimpleCard";

const ChunkCard: React.FC<{ chunk: Chunk }> = ({ chunk, children}) => {
    return <SimpleCard title={`${chunk.starttimestamp} - ${chunk.endtimestamp}`}>{children}</SimpleCard>
}

export default ChunkCard;