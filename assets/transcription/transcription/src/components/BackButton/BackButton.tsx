import { ButtonBase, makeStyles } from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles({
  backButton: {},
});

type BackButtonProps = {
  action: () => void,
}

const BackButton: React.FC<BackButtonProps> = ({ action }) => {
  const classes = useStyles();

  return (
    <ButtonBase className={classes.backButton} onClick={action}>
      <ChevronLeft />
      Back
    </ButtonBase>
  );
};

export default BackButton;