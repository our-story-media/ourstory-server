// External Dependencies
import React, { useMemo, useState, useCallback } from "react";
import LocalizedStrings from "react-localization";

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
} from "../../utils/chunkManipulation/chunkManipulation";
import useToggle from "../../hooks/useToggle";
import ContributerListModal from "../ContributersModal/ContributersModal";
import useLocalStorage from "../../hooks/useLocalStorage";

const strings = new LocalizedStrings({
  en: {
    loading: "Loading",
    viewInstructions: "View Instructions",
    chunking: "Chunking",
    dashboard: "Dashboard",
    reviewing: "Reviewing",
    transcribing: "Transcribing",
    showContributions: "Show Contributions"
  },
});

const getTitle = (view: View) => {
  switch (view) {
    case View.Chunking:
      return strings.chunking;
    case View.Dashboard:
      return strings.dashboard;
    case View.Reviewing:
      return strings.reviewing;
    case View.Transcribing:
      return strings.transcribing;
  }
};

const App: React.FC<{}> = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const { ChunksProvider } = chunksContext;

  const story_id = useStoryId();

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

  const exit = useCallback(() => setView(View.Dashboard), []);

  // const onBoardingItem = ()=>{
  //   return {
  //     handler: (): void => {
  //     setShowChunkEditorOnboarding("true");
  //   }
  // };
  // };

  const contextMenuItems = useMemo(
    () =>
        view === View.Chunking
          ? [{
              content: <div>{strings.viewInstructions}</div>,
              handler: (): void => {
                setShowChunkEditorOnboarding("true");
              },
            }]
          : view === View.Reviewing
          ? [{
              content: <div>{strings.viewInstructions}</div>,
              handler: (): void => {
                setShowReviewerOnboarding("true");
              },
            }]
          : view === View.Transcribing
          ? [{
              content: <div>{strings.viewInstructions}</div>,
              handler: (): void => {
                setShowTranscriberOnboarding("true");
              },
            }]
          : [],
    [
      view,
      // setShowChunkEditorOnboarding,
      // setShowReviewerOnboarding,
      // toggleShowContributers,
    ]
  );

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
            title={getTitle(view)}
            hidden={view === View.Transcribing}
            contextMenuItems={contextMenuItems}
            // showOnBoarding={onBoardingItem}
          >
            {view === View.Dashboard ? (
              <Dashboard
                steps={steps}
                storyName={storyTitle ? storyTitle : strings.loading}
                logOutAction={logOutAction}
              />
            ) : view === View.Chunking ? (
              <ChunkEditor
                story_id={story_id}
                atExit={exit}
                onboarding={{
                  showOnboardingModal: showChunkEditorOnboarding === "true",
                  dismissOnboardingModal: () =>
                    setShowChunkEditorOnboarding("false"),
                }}
              />
            ) : view === View.Transcribing ? (
              <Transcriber
                story_id={story_id}
                atExit={exit}
                onboarding={{
                  showOnboardingModal: showTranscriberOnboarding === "true",
                  dismissOnboardingModal: () =>
                    setShowTranscriberOnboarding("false"),
                }}
              />
            ) : view === View.Reviewing ? (
              <Reviewer
                atExit={exit}
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
