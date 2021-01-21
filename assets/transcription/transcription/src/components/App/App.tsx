/**
 * TODO -
 *
 *  - Colorize Chunks - only if adding the thumbnail isn't enough to identify each chunk
 *  - Add some sort of indicator to chunk cards if they have a transcription associated
 *    with them
 *
 *  - Consider locking Transcription step until done with chunking
 *
 *  - Add ability to edit during Review
 */

// External Dependencies
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
import useToggle from "../../hooks/useToggle";
import ContributerListModal from "../ContributersModal/ContributersModal";

const App: React.FC<{}> = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const { ChunksProvider } = chunksContext;
  const {
    storyTitle,
    chunksState: [chunks, setChunks],
  } = useOurstoryApi();

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
    <ChunksProvider state={[chunks, setChunks]}>
      <UserProvider>
        <main>
          <ContributerListModal
            chunks={chunks}
            show={showContributers}
            exit={toggleShowContributers}
          />
          <Header
            title={View[view]}
            contextMenuItems={[
              {
                content: "Show Contributers",
                handler: toggleShowContributers,
              },
            ]}
          >
            {view === View.Dashboard ? (
              <Dashboard
                steps={steps}
                storyName={storyTitle ? storyTitle : "Loading"}
              />
            ) : view === View.Chunking ? (
              <ChunkEditor atExit={() => setView(View.Dashboard)} />
            ) : view === View.Transcribing ? (
              <Transcriber
                story_id={story_id}
                atExit={() => setView(View.Dashboard)}
              />
            ) : view === View.Reviewing ? (
              <Reviewer
                atExit={() => setView(View.Dashboard)}
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
