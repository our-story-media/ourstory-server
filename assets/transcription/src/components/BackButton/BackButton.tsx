import { ButtonBase, makeStyles, Typography } from "@material-ui/core";
import LocalizedStrings from "react-localization";
import { ChevronLeft } from "@material-ui/icons";
import React from "react";

const strings = new LocalizedStrings({
  en: {
    back: "Back",
  },
});

const useStyles = makeStyles({
  backButton: {},
});

type BackButtonProps = {
  action: () => void;
};

const BackButton: React.FC<BackButtonProps> = ({ action }) => {
  const classes = useStyles();

  return (
    <ButtonBase className={classes.backButton} onClick={action}>
      <ChevronLeft fontSize="large" />
      <Typography variant="h5" style={{ position: "relative", left: -5 }}>
        {strings.back}
      </Typography>
    </ButtonBase>
  );
};

export default BackButton;
