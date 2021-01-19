// External Dependencies
import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useRenameChunk } from "../../utils/ChunksContext/chunksActions";

// Internal Dependencies
import { Chunk, State } from "../../utils/types";
import CentralModal from "../CentralModal/CentralModal";
import ChunkCropper from "../ChunkEditor/ChunkCropper";

const ChunkNameEditor: React.FC<{ nameState: State<string> }> = ({
  nameState: [name, setName],
}) => {
  return (
    <TextField
      variant="outlined"
      label="Edit Name"
      style={{ marginTop: "8px" }}
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
};

const EditChunkModal: React.FC<{
  chunk: Chunk | undefined;
  shown: boolean;
  exit: () => void;
  storyDuration: number;
}> = ({ chunk, shown, exit, storyDuration }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    chunk && chunk.name && setName(chunk.name);
  }, [chunk]);

  const saveName = useRenameChunk();

  return (
    <CentralModal
      exit={() => {
        chunk && saveName(chunk, name);
        exit();
      }}
      open={shown}
      header={<ChunkNameEditor nameState={[name, setName]} />}
    >
      <div>
        {chunk && <ChunkCropper storyDuration={storyDuration} chunk={chunk} />}
      </div>
    </CentralModal>
  );
};

export default EditChunkModal;
