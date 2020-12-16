// External Dependencies
import { ThemeProvider } from "@material-ui/core";
import React from "react";

// Internal Dependencies
import theme from "../../styles/theme";
import Dashboard from '../Dashboard/Dashboard';

const App: React.FC<{}> = () => {
  return (
    <ThemeProvider theme={theme}>
      <main>
        <Dashboard/>
      </main>
    </ThemeProvider>
  );
};

export default App;
