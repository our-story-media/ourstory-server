// External Dependencies
import { TextField } from "@material-ui/core";
import LocalizedStrings from "react-localization";
import React, { ReactNode } from "react";

// Internal Dependencies
// import SimpleCard from "./SimpleCard";

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
  // console.log(transcriptionValue)
  return (
      // <SimpleCard
      //   title={transcriptionIcon}
      //   cardStyle={{ paddingBottom: "0px" }}
      // >
      <TextField
        autoFocus
        multiline
        rows={7}
        inputRef={inputRef}
        style={{ width: "100%" }}
        variant="outlined"
        label={strings.transcription}
        value={transcriptionValue}
        color="secondary"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    // </SimpleCard>
  );
};

export default EditTranscriptionCard;
