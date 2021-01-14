import { DialogContent, makeStyles, Modal, ModalProps } from "@material-ui/core";
import React from "react";
import FlatPaper from "../FlatPaper/FlatPaper";

const useStyles = makeStyles({
  modal: {
    outline: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContentBox: {
    padding: "16px",
  },
});

type CentralModalProps = ModalProps;

const CentralModal: React.FC<CentralModalProps> = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <Modal className={classes.modal} {...props}>
      <DialogContent style={{outline: "none"}}>
        <FlatPaper>
          <div className={classes.modalContentBox}>{children}</div>
        </FlatPaper>
      </DialogContent>
    </Modal>
  );
};

export default CentralModal;
