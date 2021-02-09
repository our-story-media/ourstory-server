/**
 * - Don't expose other people's transcriptions in Transcriber component
 * - Hide Edit and Delete Button in ChunkEditor
 * - Ditch red borders on boxes
 * - Ditch box inside box in review interface
 * - Add last time edited to Contributions list
 */

// External Dependencies
import React, { useMemo, useState } from "react";

// Internal Dependencies
import ChunkEditor from "../ChunkEditor/ChunkEditor";
import Dashboard from "../Dashboard/Dashboard";
import Header from "../Header/Header";
import useSteps from "./hooks/useSteps";
import View from "./Views";
import { useStoryId } from "../../utils/getId";
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
import { Switch } from "@material-ui/core";
import useLocalStorage from "../../hooks/useLocalStorage";

const App: React.FC<{}> = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const { ChunksProvider } = chunksContext;
  const [usingVidOneString, setUsingVidOneString] = useLocalStorage(
    "useVidOne"
  );

  if (usingVidOneString === null) {
    setUsingVidOneString("true");
  }

  const usingVidOne = useMemo(() => {
    console.log(usingVidOneString);
    return usingVidOneString === "true";
  }, [usingVidOneString]);

  const story_id = useStoryId(usingVidOne);

  const {
    storyTitle,
    chunksState: [chunks, setChunks],
  } = useOurstoryApi(story_id);

  const chunkingProgress = useMemo(() => getLastEndTimeSeconds(chunks), [
    chunks,
  ]);
  const transcriptionProgress = useMemo(
    () =>
      chunks.length ? countChunksWithTranscription(chunks) / chunks.length : 0,
    [chunks]
  );
  const reviewProgress = useMemo(
    () => (chunks.length ? countReviewedChunks(chunks) / chunks.length : 0),
    [chunks]
  );

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

  const [
    showChunkEditorOnboarding,
    setShowChunkEditorOnboarding,
  ] = useLocalStorage("showChunkEditorOnboardingModal", "true");
  const [
    showTranscriberOnboarding,
    setShowTranscriberOnboarding,
  ] = useLocalStorage("showTranscriberOnboardingModal", "true");

  const [showReviewerOnboardring, setShowReviewerOnboarding] = useLocalStorage(
    "showReviewerOnboardingModal",
    "true"
  );

  const logOutAction = () => {
    setShowChunkEditorOnboarding("true");
    setShowTranscriberOnboarding("true");
    setShowReviewerOnboarding("true");
  };

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
            hidden={view === View.Transcribing}
            contextMenuItems={[
              {
                content: "Show Contributions",
                handler: toggleShowContributers,
              },
              {
                content: (
                  <div>
                    Use Video One{" "}
                    <Switch
                      checked={usingVidOne}
                      onChange={() =>
                        setUsingVidOneString((usingVidOneString) =>
                          usingVidOneString === "true" ? "false" : "true"
                        )
                      }
                    />
                  </div>
                ),
                handler: () => null,
              },
            ]}
          >
            {view === View.Dashboard ? (
              <Dashboard
                steps={steps}
                storyName={storyTitle ? storyTitle : "Loading"}
                logOutAction={logOutAction}
              />
            ) : view === View.Chunking ? (
              <ChunkEditor
                story_id={story_id}
                atExit={() => setView(View.Dashboard)}
                onboarding={{
                  showOnboardingModal: showChunkEditorOnboarding === "true",
                  dismissOnboardingModal: () =>
                    setShowChunkEditorOnboarding("false"),
                }}
              />
            ) : view === View.Transcribing ? (
              <Transcriber
                story_id={story_id}
                atExit={() => setView(View.Dashboard)}
                onboarding={{
                  showOnboardingModal: showTranscriberOnboarding === "true",
                  dismissOnboardingModal: () =>
                    setShowTranscriberOnboarding("false"),
                }}
              />
            ) : view === View.Reviewing ? (
              <Reviewer
                atExit={() => setView(View.Dashboard)}
                story_id={story_id}
                onboarding={{
                  showOnboardingModal: showReviewerOnboardring === "true",
                  dismissOnboardingModal: () =>
                    setShowReviewerOnboarding("false"),
                }}
              />
            ) : null}
          </Header>
        </main>
      </UserProvider>
    </ChunksProvider>
  );
};

export default App;
