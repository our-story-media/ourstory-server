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
};

const Slideshow: React.FC<SlideshowProps> = ({
  onNavBack,
  onNavForward,
  currentPage,
  numberOfPages,
  children,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.slideshowContainer}>
      <IndabaButton
        round
        aria-label="Previous Chunk"
        style={{ color: "#FFFFFF" }}
        disabled={currentPage === 0}
        onClick={() => onNavBack && onNavBack()}
      >
        <NavigateBefore />
      </IndabaButton>
      <Box className={classes.slideshowContentContainer}>{children}</Box>
      <IndabaButton
        round
        aria-label="Next Chunk"
        style={{ color: "#FFFFFF" }}
        disabled={currentPage === numberOfPages - 1}
        onClick={() => onNavForward && onNavForward()}
      >
        <NavigateNext />
      </IndabaButton>
    </Box>
  );
};

export default Slideshow