import { TextField } from "@material-ui/core";
import React, { ReactNode } from "react";
import SimpleCard from "./SimpleCard";

type EditTranscriptionCardProps = {
  inputRef?: React.MutableRefObject<null>;
  transcriptionIcon?: ReactNode,
  transcriptionValue: string;
  onChange: (newValue: string) => void;
};

const EditTranscriptionCard: React.FC<EditTranscriptionCardProps> = ({
  inputRef,
  transcriptionValue,
  transcriptionIcon,
  onChange,
}) => {

  return (
    <SimpleCard title={transcriptionIcon} cardStyle={{margin: "16px 8px 0 8px"}} >
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
    </SimpleCard>
  );
};

export default EditTranscriptionCard;
