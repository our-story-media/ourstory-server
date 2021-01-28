import { TextField } from "@material-ui/core";
import React from "react";
import { Chunk, State } from "../../utils/types";
import ChunkCard from "./ChunkCard";

type EditTranscriptionCardProps = {
  inputRef?: React.MutableRefObject<null>;
  chunk: Chunk;
  transcriptionState: State<string>;
}

const EditTranscriptionCard: React.FC<EditTranscriptionCardProps> = ({ inputRef, chunk, transcriptionState }) => {
  const [transcription, setTranscription] = transcriptionState;

  return (
    <ChunkCard chunk={chunk} style={{margin: "4px"}}>
      <TextField
        autoFocus
        multiline
        rows={10}
        inputRef={inputRef}
        style={{width: "100%"}}
        variant="outlined"
        label="Transcription"
        value={transcription}
        onChange={(e) => setTranscription(e.target.value)}
      />
    </ChunkCard>
  );
};

export default EditTranscriptionCard;
