import { Box } from "@material-ui/core";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import React from "react";
import IndabaButton from "../IndabaButton/IndabaButton";
import useStyles from "./SlideshowStyles";

type SlideshowProps = {
  onNavBack?: () => void;
  onNavForward?: () => void;
  currentPage: number;
  numberOfPages: number;
  style?: any,
};

const Slideshow: React.FC<SlideshowProps> = ({
  onNavBack,
  onNavForward,
  currentPage,
  numberOfPages,
  children,
  style,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.slideshowContainer} style={style}>
      <IndabaButton
        round
        aria-label="Previous Chunk"
        style={{ color: "#FFFFFF", alignSelf: "flex-start", marginTop: "32px" }}
        disabled={currentPage === 0}
        onClick={() => onNavBack && onNavBack()}
      >
        <NavigateBefore />
      </IndabaButton>
      <Box className={classes.slideshowContentContainer}>{children}</Box>
      <IndabaButton
        round
        aria-label="Next Chunk"
        style={{ color: "#FFFFFF", alignSelf: "flex-start", marginTop: "32px" }}
        disabled={currentPage === numberOfPages - 1}
        onClick={() => onNavForward && onNavForward()}
      >
        <NavigateNext />
      </IndabaButton>
    </div>
  );
};

export default Slideshow