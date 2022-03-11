import { Divider, Typography } from "@material-ui/core";
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
        <Typography variant="h5">
          Please enter your name
        </Typography>
        <Divider variant="fullWidth" style={{marginTop:'0.5em', marginBottom:'1.5em' }} />
        <SimpleInputForm
          placeholder="My Name"
          buttonText="Start Transcribing"
          classes={classes}
          onSubmit={setName}
        />
      </div>
    </CentralModal>
  );
};

export default NameModal;
