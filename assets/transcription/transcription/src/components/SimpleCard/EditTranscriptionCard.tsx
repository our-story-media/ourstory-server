import { TextField } from "@material-ui/core";
import FocusTrap from "focus-trap-react";
import React from "react";
import { Chunk, State } from "../../utils/types";
import ChunkCard from "./ChunkCard";

type EditTranscriptionCardProps = {
  inputRef?: React.MutableRefObject<null>;
  chunk: Chunk;
  transcriptionState: State<string>;
  onChange?: () => void;
};

const EditTranscriptionCard: React.FC<EditTranscriptionCardProps> = ({
  inputRef,
  chunk,
  transcriptionState,
  onChange,
}) => {
  const [transcription, setTranscription] = transcriptionState;

  return (
    <ChunkCard chunk={chunk} style={{ margin: "4px" }}>
      <TextField
        autoFocus
        multiline
        rows={7}
        inputRef={inputRef}
        style={{ width: "100%" }}
        variant="outlined"
        label="Transcription"
        value={transcription}
        onChange={(e) => {
          onChange && onChange();
          setTranscription(e.target.value);
        }}
      />
    </ChunkCard>
  );
};

export default EditTranscriptionCard;
