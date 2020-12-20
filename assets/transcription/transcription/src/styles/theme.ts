import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiButtonBase: {
      root: {
        padding: "0px 8px 0px 8px",
        backgroundColor: "#d9534f",
        color: "#FFFFFF",
        lineHeight: "34px",
        borderRadius: "8px",
        '&$disabled': {
          backgroundColor: "gray",
        }
      },
    },
  },
});

export default theme;
