// External Dependencies
import { TextField } from "@material-ui/core";
import LocalizedStrings from "react-localization";
import React, { ReactNode } from "react";

// Internal Dependencies
import SimpleCard from "./SimpleCard";

const strings = new LocalizedStrings({
  en: {
    transcription: "Transcription",
  },
});

type EditTranscriptionCardProps = {
  inputRef?: React.MutableRefObject<null>;
  transcriptionIcon?: ReactNode;
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
    <SimpleCard
      title={transcriptionIcon}
      cardStyle={{ margin: "16px 8px 0 8px" }}
    >
      <TextField
        autoFocus
        multiline
        rows={7}
        inputRef={inputRef}
        style={{ width: "100%" }}
        variant="outlined"
        label={strings.transcription}
        value={transcriptionValue}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </SimpleCard>
  );
};

export default EditTranscriptionCard;
