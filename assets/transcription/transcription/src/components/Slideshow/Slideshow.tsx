import { Box, IconButton } from "@material-ui/core";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import React from "react";
import useStyles from "./SlideshowStyles";

type SlideshowProps = {
  onNavBack: () => void;
  onNavForward: () => void;
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
      <IconButton
        aria-label="Previous Chunk"
        style={{ color: "#FFFFFF" }}
        disabled={currentPage === 0}
        onClick={onNavBack}
      >
        <NavigateBefore />
      </IconButton>
      <Box className={classes.slideshowContentContainer}>{children}</Box>
      <IconButton
        aria-label="Next Chunk"
        style={{ color: "#FFFFFF" }}
        disabled={currentPage === numberOfPages - 1}
        onClick={onNavForward}
      >
        <NavigateNext />
      </IconButton>
    </Box>
  );
};

export default Slideshow