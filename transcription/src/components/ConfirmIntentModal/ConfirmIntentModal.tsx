import { Typography,Divider,Button } from "@material-ui/core";
// import { Delete } from "@material-ui/icons";
import React, { PropsWithChildren, ReactElement } from "react";
import { NotAttemptingAction } from "../../hooks/useConfirmBeforeAction";
import CentralModal from "../CentralModal/CentralModal";
// import IndabaButton from "../IndabaButton/IndabaButton";
import WarningMessage from "../WarningMessage/WarningMessage";

type ConfirmIntentModalProps<T extends any[]> = {
  actionControls: {
    attemptingActionWith: T | NotAttemptingAction;
    cancelAction: () => void;
    confirmAction: () => void;
  };
  warningMessage: ReactElement;
  children: (...args: T) => ReactElement;
};
const ConfirmIntentModal = <T extends any[]>(
  props: PropsWithChildren<ConfirmIntentModalProps<T>>
) => {
  const { actionControls, warningMessage, children } = props;

  const { attemptingActionWith, cancelAction, confirmAction } = actionControls;

  return (
    <CentralModal
      open={attemptingActionWith !== NotAttemptingAction.True}
      exit={cancelAction}
      header={<WarningMessage message={warningMessage} />}
    >
      <div>
        {attemptingActionWith !== NotAttemptingAction.True &&
          children(...attemptingActionWith)}
        <br />
        <Divider variant="fullWidth" style={{marginLeft:'-8px',marginRight:'-8px'}} />
        <div style={{ display: "flex", justifyContent: "end", margin:'4px'}}>
          <Button variant="text" onClick={confirmAction}>
          <Typography variant="subtitle1">Confirm</Typography>
            </Button>
          {/* <IndabaButton style={{ marginTop: "8px" }} onClick={confirmAction}> */}
            {/* <Delete fontSize="large" style={{ marginRight: "8px" }} /> */}
            {/* <Typography variant="subtitle1">Confirm</Typography> */}
          {/* </IndabaButton> */}
        </div>
      </div>
    </CentralModal>
  );
};

export default ConfirmIntentModal;
