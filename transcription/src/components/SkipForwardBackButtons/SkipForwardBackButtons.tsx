import { Replay5, Forward5 } from "@material-ui/icons";
import React from "react";
import IndabaButton from "../IndabaButton/IndabaButton";

type SkipForwardBackButtonsProps = {
  skipForward: () => void;
  skipBackward: () => void;
  style?: any;
};

const SkipForwardBackButtons: React.FC<SkipForwardBackButtonsProps> = ({
  skipForward,
  skipBackward,
  style
}) => {
  return (
    <div
      style={style ? {...style} : {
        margin: "16px 16px 32px 16px",
        display: "flex"
      }}
    >
      <IndabaButton
        round
        aria-label="Go Back"
        style={{ margin: "8px"}}
        onClick={skipBackward}
      >
        <Replay5 />
      </IndabaButton>
      <IndabaButton
        round
        aria-label="Go Forward"
        style={{ margin: "8px" }}
        onClick={skipForward}
      >
        <Forward5 />
      </IndabaButton>
    </div>
  );
};

export default SkipForwardBackButtons;
