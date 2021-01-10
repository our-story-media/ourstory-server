import { Modal, Typography } from "@material-ui/core";
import React from "react";
import { StateSetter } from "../../utils/types";
import FlatPaper from "../FlatPaper/FlatPaper";
import SimpleInputForm from "../SimpleInputForm/SimpleInputForm";
import useStyles from "./NameModalStyles";



type NameModalProps = {
  show: boolean,
  setName: StateSetter<string | null>
}

const NameModal: React.FC<NameModalProps> = ({ show, setName }) => {

  const classes = useStyles();

  return (
      <Modal
        disableEnforceFocus
        disableAutoFocus
        className={classes.modal}
        open={show}
      >
        <FlatPaper className={classes.modalContentBox}>
          <Typography variant="subtitle1">
            Please enter your name before performing transcription.
          </Typography>
          <SimpleInputForm
            placeholder="my name"
            buttonText="Perform Transcription"
            classes={classes}
            onSubmit={setName}
          />
        </FlatPaper>
      </Modal>);
}

export default NameModal;