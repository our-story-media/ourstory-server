import { makeStyles, Slider, SliderProps } from "@material-ui/core";

const useStyles = makeStyles({
  progressBarColor: {
    color: "#f54414",
  },
  progressBarRoot: {
    padding: "0px",
    width: "96%",
    transform: "translateX(2%)",
    height: 6,
  },
  progressBarRail: {
    height: 6,
  },
  progressBarTrack: {
    height: 6,
  },
  progressBarThumb: {
    height: 18,
    width: 18,
    marginTop: -6,
  },
  progressBarMark: {
    height: 14,
    marginTop: -3,
  },
  markedSlider: {
    margin: 0,
  }
});

const IndabaSlider: React.FC<SliderProps & { styles?: any }> = ({
  styles,
  ...props
}) => {
  const classes = useStyles();
  return (
    <div style={styles}>
      <Slider
        classes={{
          colorPrimary: classes.progressBarColor,
          root: classes.progressBarRoot,
          rail: classes.progressBarRail,
          track: classes.progressBarTrack,
          thumb: classes.progressBarThumb,
          mark: classes.progressBarMark,
          marked: classes.markedSlider,
        }}
        {...props}
      />
    </div>
  );
};

export default IndabaSlider;
