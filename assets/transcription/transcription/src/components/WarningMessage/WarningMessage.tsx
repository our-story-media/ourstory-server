import { Warning } from "@material-ui/icons";
import React, { ReactNode } from "react";

type WarningMessageProps = {
  message: string | ReactNode;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
  return (
    <h2 style={{ margin: 0 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Warning style={{ marginRight: "8px" }} fontSize="large" />
              {message}
            </div>
          </h2>

  );
}

export default WarningMessage;