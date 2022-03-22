import { Fab, makeStyles } from "@material-ui/core";
// import LocalizedStrings from "react-localization";
import { ChevronLeft } from "@material-ui/icons";
import React from "react";

// const strings = new LocalizedStrings({
//   en: {
//     back: "Back",
//   },
// });

const useStyles = makeStyles({
  backButton: {
    // marginTop:'-1em',
    // marginLeft:'28px',
    position:'fixed',
    top:'8px',
    left:'8px',
    // marginBottom:'1.5em'
  },
});

type BackButtonProps = {
  action: () => void;
};

const BackButton: React.FC<BackButtonProps> = ({ action }) => {
  const classes = useStyles();

  return (
    // <ButtonBase className={classes.backButton} onClick={action}>
    <Fab onClick={action} className={classes.backButton}>
      <ChevronLeft fontSize="large" />
      {/* <Typography variant="h5" style={{ position: "relative", left: -5 }}>
        {strings.back}
      </Typography> */}
    {/* </ButtonBase> */}
    </Fab>
  );
};

export default BackButton;
