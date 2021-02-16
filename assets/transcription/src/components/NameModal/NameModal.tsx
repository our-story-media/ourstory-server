import { Typography } from "@material-ui/core";
import React from "react";
import CentralModal from "../CentralModal/CentralModal";
import { StateSetter } from "../../utils/types";
import SimpleInputForm from "../SimpleInputForm/SimpleInputForm";
import useStyles from "./NameModalStyles";

type NameModalProps = {
  show: boolean;
  setName: StateSetter<string | undefined>;
};

const NameModal: React.FC<NameModalProps> = ({ show, setName }) => {
  const classes = useStyles();

  return (
    <CentralModal open={show}>
      <div>
        <Typography variant="subtitle1">
          Please enter your name before performing transcription:
        </Typography>
        <SimpleInputForm
          placeholder="my name"
          buttonText="Perform Transcription"
          classes={classes}
          onSubmit={setName}
        />
      </div>
    </CentralModal>
  );
};

export default NameModal;
