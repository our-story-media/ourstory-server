import { Button, ButtonProps, createStyles, makeStyles, Theme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const useButtonStyles = makeStyles({
  button: (round) => ({
    backgroundColor: "#d9534f",
    color: "#FFFFFF",
    lineHeight: "34px",
    height: "60px",
    borderRadius: round ? "50%" : "6px",
    padding: round ? "4px" : "3px 8px 3px 8px",
    textTransform: "none",
    '&:hover': {
      backgroundColor: "#ff7570",
    },
    '&:disabled': {
      backgroundColor: "#fabbb9",
    }
  }),
});

const IndabaButton: React.FC<
  ButtonProps & { round?: boolean; styles?: any }
> = ({ children, round, styles, ...props }) => {
  const useStyleClass = makeStyles({ overrideStyles: { ...styles }});
  const overrideClass = useStyleClass()

  const classes = useButtonStyles(!!round);

  return (
    <Button className={`${classes.button} ${overrideClass.overrideStyles}`} {...props}>
      {children}
    </Button>
  );
};

export default IndabaButton;
