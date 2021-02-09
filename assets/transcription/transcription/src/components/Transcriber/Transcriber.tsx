// External Dependencies
import {
  Box,
  Button,
  Container,
  MobileStepper,
  Slider,
} from "@material-ui/core";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDebounceCallback } from "@react-hook/debounce";

// Internal Dependencies
import oneSatisfies from "../../utils/oneSatisfies";
import { Chunk } from "../../utils/types";
import { UserContext } from "../UserProvider/UserProvider";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useStyles from "./TranscriberStyles";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import useSlideshow from "../../hooks/useSlideshow";
import { useUpdateTranscription } from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import Slideshow from "../Slideshow/Slideshow";
import IndabaButton from "../IndabaButton/IndabaButton";
import BackButton from "../BackButton/BackButton";
import useFirstRender from "../../hooks/useFirstRender";
import EditTranscriptionCard from "../SimpleCard/EditTranscriptionCard";
import SkipForwardBackButtons from "../SkipForwardBackButtons/SkipForwardBackButtons";
import { api_base_address } from "../../utils/getApiKey";
import { ArrowLeft, ArrowRight, Check } from "@material-ui/icons";
import {
  toShortTimeStamp,
} from "../../utils/chunkManipulation";
import LoadingModal from "../LoadingModal/LoadingModal";
import OnboardingModal from "../OnboardingModal/OnboardingModal";

const EmptyComponent: React.FC<{}> = () => {
  return <div />;
};

const getUsersTranscription = (chunk: Chunk, userName: string): string =>
  oneSatisfies(chunk.transcriptions, (t) => t.creatorid === userName)
    ? chunk.transcriptions.filter((t) => t.creatorid === userName)[0].content
    : "";

type TranscriberProps = {
  story_id: string;
  atExit: () => void;
  onboarding: {
    showOnboardingModal: boolean;
    dismissOnboardingModal: () => void;
  };
};

const getMiniChunks = (chunk: Chunk, duration: number) => {
  var miniChunks: number[] = [];

  var currentTime = chunk.starttimeseconds + 4 / duration;

  while (currentTime < chunk.endtimeseconds) {
    miniChunks.push(currentTime);
    currentTime += 5 / duration;
  }

  return miniChunks;
};

const Transcriber: React.FC<TranscriberProps> = ({
  story_id,
  atExit,
  onboarding,
}) => {
  const [chunks] = chunksContext.useChunksState();

  const { showOnboardingModal, dismissOnboardingModal } = onboarding;

  const {
    progressState,
    playerRef,
    splitState: [, setSplit],
    duration,
    controller,
    playingState: [playing, setPlaying],
  } = useVideoPlayerController();

  const { setProgressWithVideoUpdate } = progressState;

  const { userName } = useContext(UserContext);

  const [transcription, setTranscription] = useState("");

  const { page, direction, goTo } = useSlideshow(chunks);

  const updateTranscription = useUpdateTranscription();

  /*
   * firstRender and this effect are used to update
   * the transcription of the page everytime the page changes.
   * (we don't want to do the effect on the first render)
   */
  const firstRender = useFirstRender();
  useEffect(() => {
    userName && setTranscription(getUsersTranscription(currentChunk, userName));
    console.log(`Page changed, transcription: ${transcription}`);
    !firstRender &&
      userName &&
      updateTranscription(
        chunks[page + (direction === "next" ? -1 : 1)],
        transcription,
        userName
      );
  }, [page, direction]);

  const currentChunk = useMemo(() => chunks[page], [chunks, page]);

  /* Each chunk is presented as a series of smaller, mini, chunks */
  const [miniChunks, setMiniChunks] = useState<{
    chunks: number[];
    currentChunk: number;
  }>({ chunks: [], currentChunk: 0 });

  useEffect(() => {
    const newMiniChunks = getMiniChunks(currentChunk, duration);
    setMiniChunks({
      chunks: newMiniChunks,
      currentChunk: direction === "prev" ? newMiniChunks.length - 1 : 0,
    });
  }, [currentChunk, duration, direction]);

  const currentMiniChunkStart = useMemo(() => {
    return (
      miniChunks.chunks[miniChunks.currentChunk - 1] ??
      currentChunk.starttimeseconds
    );
  }, [miniChunks, duration]);

  const currentMiniChunkEnd = useMemo(() => {
    const value = miniChunks.chunks[miniChunks.currentChunk] + 1 / duration;
    return value > duration ? duration : value;
  }, [miniChunks, duration]);

  useEffect(() => {
    setSplit({
      start: currentMiniChunkStart,
      end: currentMiniChunkEnd,
    });
    setProgressWithVideoUpdate(currentMiniChunkStart);
  }, [chunks, page, userName, miniChunks, duration]);

  const classes = useStyles();

  const inputRef = useRef(null);

  useEffect(() => {
    (inputRef.current
      ? (inputRef.current as any)
      : { focus: () => null }
    ).focus();
  }, [page, miniChunks.currentChunk, playing]);

  const exitHandler = () => {
    userName && updateTranscription(currentChunk, transcription, userName);
    atExit();
  };

  const miniChunkClickHandler = useCallback(
    (action: "next" | "prev") =>
      setMiniChunks((prev_mini_chunks) => ({
        ...prev_mini_chunks,
        currentChunk:
          prev_mini_chunks.currentChunk + (action === "next" ? 1 : -1),
      })),
    []
  );

  const debouncedPlay = useDebounceCallback(() => setPlaying(true), 500);

  const onType = () => {
    setPlaying(false);
    debouncedPlay();
  };

  const handleNextButtonPressed = () => {
    if (miniChunks.currentChunk === miniChunks.chunks.length - 1) {
      goTo("next");
    } else {
      miniChunkClickHandler("next");
    }
  };
  const handlePrevButtonPressed = () => {
    if (miniChunks.currentChunk === 0) {
      goTo("prev");
    } else {
      miniChunkClickHandler("prev");
    }
  };

  const finalMiniChunk = useMemo(
    () =>
      page === chunks.length - 1 &&
      miniChunks.currentChunk === miniChunks.chunks.length - 1,
    [page, miniChunks, chunks.length]
  );

  return (
    <div>
      <LoadingModal open={duration === 0} />
      <Container style={{ marginTop: "4px" }}>
        <BackButton action={exitHandler} />
      </Container>
      <OnboardingModal
        show={showOnboardingModal}
        dismiss={dismissOnboardingModal}
        title={<h2 style={{ margin: 0 }}>Transcribing Instructions</h2>}
        steps={[
          "You are about to Transcribe the chunks.",
          "Each chunk has been divided into 5 second clips for you. These clips will loop.",
          "When you type, the video will pause until you stop typing",
          'When you are done transcribing a clip press the ">" button',
        ]}
        startButtonContent={<div>Start Transcribing</div>}
      />
      {chunks.length && (
        <>
          <Box className={classes.videoPlayerContainer}>
            <VideoPlayer
              progressState={progressState}
              playerRef={playerRef}
              url={`http://${api_base_address}:8845/api/watch/getvideo/${story_id}`}
              controller={controller}
              loop
            />
          </Box>
          <Container style={{ height: "50vh", overflow: "scroll" }}>
            <MobileStepper
              variant="dots"
              steps={miniChunks.chunks.length}
              activeStep={miniChunks.currentChunk}
              position="static"
              classes={{
                dotActive: classes.stepperDots,
              }}
              nextButton={
                <Button
                  onClick={() =>
                    setMiniChunks({
                      ...miniChunks,
                      currentChunk: miniChunks.chunks.length - 1,
                    })
                  }
                >
                  Last
                </Button>
              }
              backButton={
                <Button
                  onClick={() =>
                    setMiniChunks({ ...miniChunks, currentChunk: 0 })
                  }
                >
                  First
                </Button>
              }
            />
            <Slideshow
              onNavigate={goTo}
              currentPage={page}
              numberOfPages={chunks.length}
              onComplete={exitHandler}
              leftColumn={
                <div>
                  <IndabaButton onClick={handlePrevButtonPressed}>
                    <ArrowLeft />
                  </IndabaButton>
                </div>
              }
              rightColumn={
                <div>
                  <IndabaButton
                    style={{
                      backgroundColor: finalMiniChunk ? "green" : "#d9534f",
                    }}
                    onClick={() =>
                      finalMiniChunk ? atExit() : handleNextButtonPressed()
                    }
                  >
                    {finalMiniChunk ? <Check /> : <ArrowRight />}
                  </IndabaButton>
                </div>
              }
            >
              <EditTranscriptionCard
                transcriptionIcon={
                  <Slider
                    ThumbComponent={EmptyComponent}
                    value={[
                      currentChunk.starttimeseconds * 100,
                      currentChunk.endtimeseconds * 100,
                    ]}
                    classes={{
                      rail: classes.chunkProgressRail,
                      track: classes.chunkProgressTrack,
                      mark: classes.chunkProgressMark,
                    }}
                    marks={[
                      {
                        value: miniChunks.chunks[miniChunks.currentChunk] * 100,
                        label: toShortTimeStamp(
                          miniChunks.chunks[miniChunks.currentChunk] * duration
                        ),
                      },
                    ]}
                  />
                }
                inputRef={inputRef}
                chunk={currentChunk}
                transcriptionState={[transcription, setTranscription]}
                onChange={onType}
              />
            </Slideshow>
          </Container>
        </>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
        }}
      >
        {false && (
          <SkipForwardBackButtons
            style={{
              margin: "8px",
              width: "calc(100% - 16px)",
              display: "flex",
              justifyContent: "space-between",
            }}
            skipForward={() =>
              duration &&
              setProgressWithVideoUpdate((progress) => progress + 5 / duration)
            }
            skipBackward={() =>
              duration &&
              setProgressWithVideoUpdate((progress) => progress - 5 / duration)
            }
          />
        )}
      </div>
    </div>
  );
};

export default Transcriber;
