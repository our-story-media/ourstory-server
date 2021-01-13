// External Dependencies
import { Box, ButtonBase, makeStyles } from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
import React, { useState } from "react";

// Internal Dependencies
import ChunkEditor from "../ChunkEditor/ChunkEditor";
import Dashboard from "../Dashboard/Dashboard";
import Header from "../Header/Header";
import useSteps from "./hooks/useSteps";
import View from "./Views";
import story_id from "../../utils/getId";
import Transcriber from "../Transcriber/Transcriber";
import UserProvider from "../UserProvider/UserProvider";
import useOurstoryApi from "./hooks/useOurstoryApi";
import { Reviewer } from "../Reviewer/Reviewer";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import {
  countChunksWithTranscription,
  countReviewedChunks,
  getLastEndTimeSeconds,
} from "../../utils/chunkManipulation";
import IndabaButton from "../IndabaButton/IndabaButton";
import useToggle from "../../hooks/useToggle";
import ContributerListModal from "../ContributersModal/ContributersModal";

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

  const { ChunksProvider } = chunksContext;

  const { storyTitle, chunksState } = useOurstoryApi();

  const chunks = chunksState[0];

  const chunkingProgress = getLastEndTimeSeconds(chunks);
  const transcriptionProgress = chunks.length
    ? countChunksWithTranscription(chunks) / chunks.length
    : 0;
  const reviewProgress = chunks.length
    ? countReviewedChunks(chunks) / chunks.length
    : 0;

  const steps = useSteps(setView, [
    { progress: chunkingProgress * 100, enabled: true },
    {
      progress: transcriptionProgress * 100,
      enabled: chunkingProgress > 0,
    },
    {
      progress: reviewProgress * 100,
      enabled: transcriptionProgress > 0,
    },
  ]);

  const [showContributers, toggleShowContributers] = useToggle(false);

  return (
    <ChunksProvider state={chunksState}>
      <UserProvider>
        <main>
          <ContributerListModal
            chunks={chunks}
            show={showContributers}
            exit={toggleShowContributers}
          />
          <Header
            title={View[view]}
            contextMenu={
              <IndabaButton onClick={toggleShowContributers} style={{ backgroundColor: "gray", height: "40px" }}>
                Show Contributers
              </IndabaButton>
            }
          >
            {view === View.Dashboard ? (
              <Dashboard
                steps={steps}
                storyName={storyTitle ? storyTitle : "Loading"}
              />
            ) : view === View.Chunking ? (
              <ChunkEditor
                backButton={
                  <BackButton actions={[() => setView(View.Dashboard)]} />
                }
              />
            ) : view === View.Transcribing ? (
              <Transcriber
                story_id={story_id}
                makeBackButton={(action: () => void) => (
                  <BackButton
                    actions={[action, () => setView(View.Dashboard)]}
                  />
                )}
              />
            ) : view === View.Reviewing ? (
              <Reviewer
                backButton={
                  <BackButton actions={[() => setView(View.Dashboard)]} />
                }
                story_id={story_id}
              />
            ) : null}
          </Header>
        </main>
      </UserProvider>
    </ChunksProvider>
  );
};

export default App;
