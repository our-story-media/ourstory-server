import { CircularProgress, DialogContent, makeStyles, Modal } from "@material-ui/core";
import React from "react";

type LoadingModalProps = {
  open: boolean;
};

const useStyles = makeStyles({
  loadingModal: {
    outline: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const LoadingModal: React.FC<LoadingModalProps> = ({ open }) => {
  const classes = useStyles();
  return (
    <Modal open={open} className={classes.loadingModal}>
      <DialogContent
        style={{ outline: "none", display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </DialogContent>
    </Modal>
  );
};

export default LoadingModal;