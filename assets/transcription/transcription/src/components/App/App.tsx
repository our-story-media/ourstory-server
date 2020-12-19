// External Dependencies
import {
  Box,
  ButtonBase,
  Container,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
import React, { useState } from "react";

// Internal Dependencies
import theme from "../../styles/theme";
import ChunkEditor from "../ChunkEditor/ChunkEditor";
import Dashboard from "../Dashboard/Dashboard";
import Header from "../Header/Header";
import useSteps from "./useSteps";
import View from "./Views";

const useStyles = makeStyles({
  backButton: {
    background: "transparent",
    color: "black",
    fontSize: "16px",
  },
});

const BackButton: React.FC<{action: () => void}> = ({ action }) => {
  const classes = useStyles();
  return (
    <Box>
      <ButtonBase className={classes.backButton} onClick={action}>
        <ChevronLeft />
        Back
      </ButtonBase>
    </Box>
  );
};

const App: React.FC<{}> = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const steps = useSteps(setView);

  return (
    <ThemeProvider theme={theme}>
      <main>
        <Header>
          <Container>{view !== View.Dashboard && <BackButton action={() => setView(View.Dashboard)}/>}</Container>
          {view === View.Dashboard ? (
            <Dashboard steps={steps} storyName={"Test"} />
          ) : view === View.Chunking ? (
            <ChunkEditor />
          ) : view === View.Transcribing ? (
            <div>Transcribing</div>
          ) : view === View.Reviewing ? (
            <div>Reviewing</div>
          ) : null}
        </Header>
      </main>
    </ThemeProvider>
  );
};

export default App;
