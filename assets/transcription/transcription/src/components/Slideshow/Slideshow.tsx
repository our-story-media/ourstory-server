import { Box } from "@material-ui/core";
import { Done, NavigateBefore, NavigateNext } from "@material-ui/icons";
import React from "react";
import IndabaButton from "../IndabaButton/IndabaButton";
import useStyles from "./SlideshowStyles";

type SlideshowProps = {
  onNavigate: (direction: "next" | "prev") => void;
  currentPage: number;
  numberOfPages: number;
  style?: any;
  onComplete?: () => void;
};

const Slideshow: React.FC<SlideshowProps> = ({
  onNavigate,
  onComplete,
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
        aria-label="Previous"
        style={{ color: "#FFFFFF", alignSelf: "flex-start", marginTop: "32px" }}
        disabled={currentPage === 0}
        onClick={() => onNavigate("prev")}
      >
        <NavigateBefore />
      </IndabaButton>
      <Box className={classes.slideshowContentContainer}>{children}</Box>
      {onComplete && currentPage === numberOfPages - 1 ? (
        <IndabaButton
          round
          aria-label="Complete"
          style={{
            color: "#FFFFFF",
            backgroundColor: "#40bf11",
            alignSelf: "flex-start",
            marginTop: "32px",
          }}
          onClick={onComplete}
        >
          <Done />
        </IndabaButton>
      ) : (
        <IndabaButton
          round
          aria-label="Next"
          style={{
            color: "#FFFFFF",
            alignSelf: "flex-start",
            marginTop: "32px",
          }}
          disabled={currentPage === numberOfPages - 1}
          onClick={() => onNavigate("next")}
        >
          <NavigateNext />
        </IndabaButton>
      )}
    </div>
  );
};

export default Slideshow;
