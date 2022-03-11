import { Button, ButtonProps, makeStyles } from "@material-ui/core";

const useButtonStyles = makeStyles({
  button: (round) => ({
    backgroundColor: "#d9534f",
    color: "#FFFFFF",
    lineHeight: "34px",
    minHeight: "3.5rem",
    marginLeft:'1em',
    marginRight:'1em',
    borderRadius: round ? "50%" : "8px",
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

const useStyleClass = (styles: any | undefined) => makeStyles({ overrideStyles: { ...styles }});

const IndabaButton: React.FC<
  ButtonProps & { round?: boolean; styles?: any }
> = ({ children, round, styles, ...props }) => {
  const overrideClass = useStyleClass(styles)()

  const classes = useButtonStyles(!!round);

  return (
    <Button disableRipple className={`${classes.button} ${overrideClass.overrideStyles} ${props.style}`} {...props}>
      {children}
    </Button>
  );
};

export default IndabaButton;
