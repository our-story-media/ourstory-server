// External Dependencies
import LocalizedStrings from "react-localization";
import {
  Box,
  Button,
  Container,
  MobileStepper,
  Slider,
} from "@material-ui/core";
import { ArrowLeft, ArrowRight, Check } from "@material-ui/icons";
import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

// Internal Dependencies
import { UserContext } from "../UserProvider/UserProvider";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useStyles from "./TranscriberStyles";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import { useUpdateTranscription } from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import Slideshow from "../Slideshow/Slideshow";
import IndabaButton from "../IndabaButton/IndabaButton";
import BackButton from "../BackButton/BackButton";
import EditTranscriptionCard from "../SimpleCard/EditTranscriptionCard";
import SkipForwardBackButtons from "../SkipForwardBackButtons/SkipForwardBackButtons";
import { api_base_address } from "../../utils/getApiKey";
import {
  getNameOf,
  toShortTimeStamp,
} from "../../utils/chunkManipulation/chunkManipulation";
import LoadingModal from "../LoadingModal/LoadingModal";
import OnboardingModal from "../OnboardingModal/OnboardingModal";
import useTranscriberReducer from "./hooks/useTranscriberState";
import useAutoPauseOnType from "./hooks/useAutoPauseOnType";

const strings = new LocalizedStrings({
  en: {
    instructionsOne: "You are about to Transcribe the chunks.",
    instructionsTwo:
      "Each chunk has been divided into 5 second clips for you. These clips will loop.",
    instructionsThree:
      "When you type, the video will pause until you stop typing",
    instructionsFour:
      'When you are done transcribing a clip press the ">" button',
    last: "Last",
    first: "First",
  },
});

const EmptyComponent: React.FC<{}> = () => {
  return <div />;
};

type TranscriberProps = {
  story_id: string;
  atExit: () => void;
  onboarding: {
    showOnboardingModal: boolean;
    dismissOnboardingModal: () => void;
  };
};

const Transcriber: React.FC<TranscriberProps> = ({
  story_id,
  atExit,
  onboarding,
}) => {
  const [chunks, setChunks] = chunksContext.useChunksState();

  const { showOnboardingModal, dismissOnboardingModal } = onboarding;

  const {
    progressState,
    playerRef,
    splitState: [split, setSplit],
    duration,
    controller,
    playingState: [playing, setPlaying],
  } = useVideoPlayerController();

  const updateTranscription = useUpdateTranscription(setChunks);

  const { userName } = useContext(UserContext);

  const { setProgressWithVideoUpdate } = progressState;

  const transcriberReducer = useTranscriberReducer(
    chunks,
    duration,
    updateTranscription,
    userName,
    setSplit,
    setProgressWithVideoUpdate,
    atExit
  );

  const [transcriberState, transcriberDispatch] = useReducer(
    transcriberReducer,
    {
      currentChunk: 0,
      currentMiniChunk: 0,
      miniChunks: [],
      transcription: "",
    }
  );
  useEffect(() => {
    if (duration !== 0) {
      transcriberDispatch({ actionType: "refresh mini chunks" });
    }
  }, [duration]);

  const lastPage = useMemo(
    () =>
      transcriberState.currentChunk === chunks.length - 1 &&
      transcriberState.currentMiniChunk ===
        transcriberState.miniChunks.length - 1,
    [
      transcriberState.currentChunk,
      transcriberState.currentMiniChunk,
      transcriberState.miniChunks,
      chunks,
    ]
  );

  const classes = useStyles();

  const inputRef = useRef(null);

  const focusInput = () => {
    (inputRef.current
      ? (inputRef.current as any)
      : { focus: () => null }
    ).focus();
  };

  useEffect(() => {
    focusInput();
  }, [
    playing,
    transcriberState.currentChunk,
    transcriberState.currentMiniChunk,
  ]);

  const exitHandler = () => {
    transcriberDispatch({ actionType: "flush transcription changes" });
    atExit();
  };

  const onType = useAutoPauseOnType(playing, setPlaying);

  return (
    <div>
      <LoadingModal open={duration === 0} />
      <Container style={{ marginBottom: "4px" }}>
        <BackButton action={exitHandler} />
      </Container>
      <OnboardingModal
        show={showOnboardingModal}
        dismiss={dismissOnboardingModal}
        title={<h2 style={{ margin: 0 }}>Transcribing Instructions</h2>}
        steps={[
          strings.instructionsOne,
          strings.instructionsTwo,
          strings.instructionsThree,
          strings.instructionsFour,
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
          <div style={{ margin: "0 8px 0 8px" }}>
            <MobileStepper
              variant="dots"
              steps={transcriberState.miniChunks.length}
              activeStep={transcriberState.currentMiniChunk}
              position="static"
              classes={{
                dotActive: classes.stepperDots,
                dots: classes.stepperDotsContainer,
                dot: classes.stepperDot,
              }}
              nextButton={
                <Button
                  onClick={() =>
                    transcriberDispatch({ actionType: "go to last mini chunk" })
                  }
                >
                  {strings.last}
                </Button>
              }
              backButton={
                <Button
                  onClick={() =>
                    transcriberDispatch({
                      actionType: "go to first mini chunk",
                    })
                  }
                >
                  {strings.first}
                </Button>
              }
            />
            <Slideshow
              currentPage={transcriberState.currentChunk}
              onNavigate={() => null}
              numberOfPages={chunks.length}
              onComplete={exitHandler}
              leftColumn={
                <div>
                  <IndabaButton
                    onClick={() =>
                      transcriberDispatch({ actionType: "go to previous page" })
                    }
                  >
                    <ArrowLeft />
                  </IndabaButton>
                </div>
              }
              rightColumn={
                <div>
                  <IndabaButton
                    style={{
                      backgroundColor: lastPage ? "green" : "#d9534f",
                    }}
                    onClick={() =>
                      transcriberDispatch({ actionType: "go to next page" })
                    }
                  >
                    {lastPage ? <Check /> : <ArrowRight />}
                  </IndabaButton>
                </div>
              }
            >
              <EditTranscriptionCard
                transcriptionIcon={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "0 8px 0 8px",
                    }}
                  >
                    <span style={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                      {getNameOf(chunks[transcriberState.currentChunk])}
                    </span>
                    <Slider
                      ThumbComponent={EmptyComponent}
                      value={[
                        chunks[transcriberState.currentChunk].starttimeseconds *
                          100,
                        chunks[transcriberState.currentChunk].endtimeseconds *
                          100,
                      ]}
                      classes={{
                        rail: classes.chunkProgressRail,
                        track: classes.chunkProgressTrack,
                        mark: classes.chunkProgressMark,
                        markActive: classes.chunkProgressMark,
                      }}
                      marks={[
                        {
                          value: split.start * 100,
                          label: toShortTimeStamp(
                            transcriberState.miniChunks[
                              transcriberState.currentMiniChunk
                            ] * duration
                          ),
                        },
                      ]}
                    />
                  </div>
                }
                inputRef={inputRef}
                transcriptionValue={transcriberState.transcription}
                onChange={(newValue: string) => {
                  onType();
                  transcriberDispatch({
                    actionType: "transcription changed",
                    newTranscription: newValue,
                  });
                }}
              />
            </Slideshow>
          </div>
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
