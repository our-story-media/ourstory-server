import {
  Button,
  Container,
  DialogContent,
  makeStyles,
  Modal,
  Divider,
  ModalProps,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { ReactElement } from "react";
import FlatPaper from "../FlatPaper/FlatPaper";

const useStyles = makeStyles(theme => ({
  modal: {
    outline: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContentBox: {
    padding: "8px",
  },
  modalPaper: {
    maxWith: "100%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "70%",
    },
  }
}));

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
      <DialogContent style={{ outline: "none" }} className={classes.modalPaper}>
        <FlatPaper >
          {header && (
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
                    width: "80%",
                  }}
                >
                  {header}
                </div>
                <Button onClick={exit} style={{marginRight:"-20px"}}>
                  <Close />
                </Button>
              </div>
            </Container>
          )}
          <Divider style={{marginTop:'8px'}} />
          <div className={classes.modalContentBox}>{children}</div>
        </FlatPaper>
      </DialogContent>
    </Modal>
  );
};

export default CentralModal;
