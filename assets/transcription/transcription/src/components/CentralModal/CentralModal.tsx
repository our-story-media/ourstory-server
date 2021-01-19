import {
  Container,
  DialogContent,
  Divider,
  makeStyles,
  Modal,
  ModalProps,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { ReactElement } from "react";
import FlatPaper from "../FlatPaper/FlatPaper";
import IndabaButton from "../IndabaButton/IndabaButton";

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

type CentralModalProps = ModalProps & {
  exit?: () => void;
  header?: ReactElement;
};

const CentralModal: React.FC<CentralModalProps> = ({
  children,
  header,
  exit,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Modal className={classes.modal} {...props}>
      <DialogContent style={{ outline: "none" }}>
        <FlatPaper>
          <Container>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                {header}
              </div>
              <IndabaButton onClick={exit}>
                <Close />
              </IndabaButton>
            </div>
            <Divider style={{ margin: "12px 0px 12px 0px" }} />
          </Container>
          <div className={classes.modalContentBox}>{children}</div>
        </FlatPaper>
      </DialogContent>
    </Modal>
  );
};

export default CentralModal;
