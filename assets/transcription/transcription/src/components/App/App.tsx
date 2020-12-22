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
import useSteps from "./hooks/useSteps";
import View from "./Views";
import story_id from "../../utils/getId";
import { Chunk } from "../../utils/types";
import Transcriber from "../Transcriber/Transcriber";
import UserProvider from "../UserProvider/UserProvider";
import useOurstoryApi from "./hooks/useOurstoryApi";

const useStyles = makeStyles({
  backButton: {
    background: "transparent",
    color: "black",
    fontSize: "16px",
  },
});

/**
 * A back button. When the button is pressed, the actions will be performed in
 * the order they are passed
 *
 * @param actions: the actions that will be performed when the back button is pressed
 */
const BackButton: React.FC<{ actions: (() => void)[] }> = ({ actions }) => {
  const classes = useStyles();
  return (
    <Box>
      <ButtonBase
        className={classes.backButton}
        onClick={() => actions.forEach((action) => action())}
      >
        <ChevronLeft />
        Back
      </ButtonBase>
    </Box>
  );
};

const App: React.FC<{}> = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const steps = useSteps(setView, {
    step1: true,
    step2: chunks.length > 0,
    step3: chunks.length > 0,
  });

  const storyTitle = useOurstoryApi(chunks, setChunks);

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <main>
          <Header>
            {view === View.Dashboard ? (
              <Dashboard steps={steps} storyName={storyTitle} />
            ) : view === View.Chunking ? (
              <ChunkEditor
                chunksState={[chunks, setChunks]}
                backButton={
                  <BackButton actions={[() => setView(View.Dashboard)]} />
                }
              />
            ) : view === View.Transcribing ? (
              <Transcriber
                story_id={story_id}
                chunksState={[chunks, setChunks]}
                makeBackButton={(action: () => void) => (
                  <BackButton
                    actions={[action, () => setView(View.Dashboard)]}
                  />
                )}
              />
            ) : view === View.Reviewing ? (
              <div>Reviewing</div>
            ) : null}
          </Header>
        </main>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
