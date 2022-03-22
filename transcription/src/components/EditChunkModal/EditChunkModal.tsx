// External Dependencies
import { TextField } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useCropChunk } from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import { getNameOf } from "../../utils/chunkManipulation/chunkManipulation";

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
      style={{ marginTop: "8px", width: "100%" }}
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

  const [, setChunks] = chunksContext.useChunksState();

  // useEffect(() => {
  //   chunk && setName(chunk.name ? chunk.name : "");
  // }, [chunk]);

  const cropChunk = useCropChunk(setChunks);

  const [newCropSplit, setNewCropSplit] = useState<[number, number]>([0, 0]);

  const { userName } = useContext(UserContext);

  return (
    <CentralModal
      exit={() => {
        chunk && userName && cropChunk(chunk, storyDuration, newCropSplit, userName, name);
        exit();
      }}
      open={chunk !== undefined}
      header={ <h2
        style={{ margin: 0, overflowWrap: "anywhere" }}
      >Editing {chunk && getNameOf(chunk)}</h2>}
    >
      <div style={{paddingBottom: "50px"}}>
        {chunk && <ChunkCropper story_id={story_id} croppedSplitState={[newCropSplit, setNewCropSplit]} storyDuration={storyDuration} chunk={chunk} />}
      </div>
    </CentralModal>
  );
};

export default EditChunkModal;
