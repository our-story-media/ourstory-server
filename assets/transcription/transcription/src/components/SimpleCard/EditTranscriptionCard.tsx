import { TextField } from "@material-ui/core";
import React, { ReactNode } from "react";
import { Chunk, State } from "../../utils/types";
import ChunkCard from "./ChunkCard";

type EditTranscriptionCardProps = {
  inputRef?: React.MutableRefObject<null>;
  transcriptionIcon?: ReactNode,
  chunk: Chunk;
  transcriptionValue: string;
  onChange: (newValue: string) => void;
};

const EditTranscriptionCard: React.FC<EditTranscriptionCardProps> = ({
  inputRef,
  chunk,
  transcriptionValue,
  transcriptionIcon,
  onChange,
}) => {

  return (
    <ChunkCard transcriptionIcon={transcriptionIcon} chunk={chunk} style={{ margin: "4px" }}>
      <TextField
        autoFocus
        multiline
        rows={7}
        inputRef={inputRef}
        style={{ width: "100%" }}
        variant="outlined"
        label="Transcription"
        value={transcriptionValue}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </ChunkCard>
  );
};

export default EditTranscriptionCard;
