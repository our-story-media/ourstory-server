// External Dependencies
import { TextField } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useCropChunk } from "../../utils/ChunksContext/chunksActions";

// Internal Dependencies
import { Chunk, State } from "../../utils/types";
import CentralModal from "../CentralModal/CentralModal";
import ChunkCropper from "../ChunkEditor/ChunkCropper";
import { UserContext } from "../UserProvider/UserProvider";

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
  story_id: string,
  chunk: Chunk | undefined;
  exit: () => void;
  storyDuration: number;
}> = ({ story_id, chunk, exit, storyDuration }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    chunk && setName(chunk.name ? chunk.name : "");
  }, [chunk]);

  const cropChunk = useCropChunk();

  const [newCropSplit, setNewCropSplit] = useState<[number, number]>([0, 0]);

  const { userName } = useContext(UserContext);

  return (
    <CentralModal
      exit={() => {
        chunk && userName && cropChunk(chunk, storyDuration, newCropSplit, userName, name);
        exit();
      }}
      open={chunk !== undefined}
      header={<ChunkNameEditor nameState={[name, setName]} />}
    >
      <div style={{paddingBottom: "24px"}}>
        {chunk && <ChunkCropper story_id={story_id} croppedSplitState={[newCropSplit, setNewCropSplit]} storyDuration={storyDuration} chunk={chunk} />}
      </div>
    </CentralModal>
  );
};

export default EditChunkModal;
