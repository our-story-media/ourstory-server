import { makeStyles, Slider, SliderProps } from "@material-ui/core";

const useStyles = makeStyles({
  progressBarColor: {
    color: "#f54414",
  },
  progressBarRoot: {
    padding: "0px",
    width: "96%",
    transform: "translateX(2%)",
    height: 4,
  },
  progressBarRail: {
    height: 4,
  },
  progressBarTrack: {
    height: 4,
  },
  progressBarThumb: {
    height: 12,
    marginTop: -4,
  },
  progressBarMark: {
    height: 10,
    marginTop: -3,
  },
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
        }}
        {...props}
      />
    </div>
  );
};

export default IndabaSlider;
