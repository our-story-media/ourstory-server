// External Dependencies
import { Add, Check, Stop, PlayArrow } from "@material-ui/icons";
import LocalizedStrings from "react-localization";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Grid,
  Container,
  GridList,
  GridListTile,
  Mark,
} from "@material-ui/core";

// Internal Dependencies
import ChunkCard from "../SimpleCard/ChunkCard";
import useStyles from "./ChunkEditorStyles";
import { UserContext } from "../UserProvider/UserProvider";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import {
  useDeleteChunk,
  useDoWithChunks,
  useNewChunk,
} from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import IndabaButton from "../IndabaButton/IndabaButton";
import { Chunk } from "../../utils/types";
import {
  getEnclosingChunk,
  getLastEndTimeSeconds,
  getNameOf,
  hasTranscription,
} from "../../utils/chunkManipulation/chunkManipulation";
import EditChunkModal from "../EditChunkModal/EditChunkModal";
import VideoThumbnail from "../VideoPlayer/VideoThumbnail";
import BackButton from "../BackButton/BackButton";
import useConfirmBeforeAction from "../../hooks/useConfirmBeforeAction";
import ConfirmIntentModal from "../ConfirmIntentModal/ConfirmIntentModal";
import TranscriptionsModal from "../TranscriptionsModal/TranscriptionsModal";
import SimpleCard from "../SimpleCard/SimpleCard";
import ScrollToOnMount from "../ScrollToOnMount/ScrollToOnMount";
import ChunkCardContextMenu from "./ChunkCardContextMenu";
import { api_base_address } from "../../utils/getApiKey";
import LoadingModal from "../LoadingModal/LoadingModal";
import OnboardingModal from "../OnboardingModal/OnboardingModal";

const strings = new LocalizedStrings({
  en: {
    instructionsOne:
      "You are about to chunk the video. The aim of chunking is to make Transcribing easy.",
    instructionOneStepLabel: "Faster Transcribing",
    instructionsTwo:
      "Rather than transcribing the entire video at once, you will break the video down into smaller chunks, which you will transcribe individually.",
    instructionTwoStepLabel: "Small chunks",
    instructionsThree:
      "You should aim to have only one person speaking in each chunk. Create a new chunk when there is a change in who is talking, there is a gap in the talking, or a person begins/ends talking.",
    instructionThreeStepLabel: "One Speaker per chunk",
    instructionsFour:
      "To create a chunk, press the 'Add' button in the bottom right corner. The time that you press the 'Add' button in the video will be the end of the new chunk.",
    instructionFourStepLabel: "Push 'Add' Button",
    instructionsTitle: "Chunking Instructions",
    startChunking: "Start Chunking",
    attemptDeleteWarningTitle: "This chunk has a transcription",
    attemptDeleteWarningBody:
      "Attempting to delete chunk {0}, which has a transcription saved to it. Are you sure you want to delete it?",
    attemptNewChunkTitle: "The enclosing chunk has a transcription",
    attemptNewChunkBody:
      'Creating a new chunk here will delete the transcriptions on the enclosing chunk, "{0}". Are you sure you want to discard these transcriptions?',
    delete: "Delete",
    edit: "Edit",
    viewTranscriptions: "View Transcriptions",
    newChunk: "New Chunk",
    doneCard: "Done Card",
  },
});

type ChunkEditorProps = {
  /** Action to do when back button is pressed */
  atExit: () => void;
  story_id: string;
  onboarding: {
    showOnboardingModal: boolean;
    dismissOnboardingModal: () => void;
  };
};

/**
 * Helper function that converts a list of chunks
 * to a list of marks
 *
 * @param chunks the chunks to get the marks for
 */
const getMarks = (chunks: Chunk[]): Mark[] =>
  chunks.map((chunk) => ({
    value: chunk.endtimeseconds * 100,
  }));

const ChunkEditor: React.FC<ChunkEditorProps> = ({
  atExit,
  story_id,
  onboarding,
}) => {
  const [chunks, setChunks] = chunksContext.useChunksState();

  // This refreshes the chunks when the ChunkEditor is first rendered
  useEffect(() => {
    setChunks((newChunks) => newChunks);
  }, [setChunks]);

  const {
    progressState: videoPlayerProgressState,
    playingState,
    duration,
    controller: videoPlayerController,
    playerRef,
  } = useVideoPlayerController();

  const { progress, setProgressWithVideoUpdate } = videoPlayerProgressState;

  const [, setPlay] = playingState;

  const marks = useMemo(() => getMarks(chunks), [chunks]);

  const { userName } = useContext(UserContext);

  const doWithChunks = useDoWithChunks(setChunks);
  const deleteChunk = useDeleteChunk(setChunks);
  const newChunk = useNewChunk(setChunks);

  const classes = useStyles();

  const [playingChunk, setPlayingChunk] = useState<undefined | Chunk>(
    undefined
  );

  useEffect(() => {
    if (playingChunk !== undefined && progress > playingChunk.endtimeseconds) {
      setPlayingChunk(undefined);
      setPlay(false);
    }
  }, [progress, playingChunk, chunks, setPlay]);

  const handleChunkPlayButtonClick = useCallback(
    (chunk: Chunk, playingChunk: Chunk | undefined, videoPlaying: boolean) => {
      if (playingChunk?.id === chunk.id && videoPlaying) {
        setPlay(false);
      } else {
        setPlay(true);
        setPlayingChunk(chunk);
        setProgressWithVideoUpdate(chunk.starttimeseconds);
      }
    },
    [setProgressWithVideoUpdate, setPlay]
  );

  const [croppingChunk, setCroppingChunk] = useState<Chunk | undefined>(
    undefined
  );

  const handleCompleteChunking = () => {
    getLastEndTimeSeconds(chunks) !== 1 &&
      userName &&
      newChunk(1, duration, userName);
    atExit();
  };

  const createNewChunk = (
    _: Chunk[],
    splitAt: number,
    storyDuration: number,
    userName: string
  ) => newChunk(splitAt, storyDuration, userName);

  const { attemptAction: attemptNewChunk, ...attemptNewChunkActionControls } =
    useConfirmBeforeAction(createNewChunk, (chunks, time) => {
      const enclosingChunk = getEnclosingChunk(chunks, time);
      return enclosingChunk !== undefined && hasTranscription(enclosingChunk);
    });

  const handleNewChunk = () => {
    if (userName) {
      attemptNewChunk(chunks, progress, duration, userName);
    }
  };

  const {
    attemptAction: attemptToDeleteChunk,
    ...attemptDeleteActionControls
  } = useConfirmBeforeAction(deleteChunk, (chunk) => hasTranscription(chunk));

  const [showTranscriptionsFor, setShowTranscriptionsFor] = useState<
    Chunk | undefined
  >(undefined);

  const handleAttemptDeleteChunk = (c: Chunk) => {
    doWithChunks((chunks: Chunk[]) => {
      chunks.forEach(
        (chunk) => chunk.id === c.id && attemptToDeleteChunk(chunk)
      );
    });
  };

  const playButtonStyle = useMemo(
    () => ({
      marginRight: "4px",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 0.8,
    }),
    []
  );

  const chunkCardContentStyle = useRef({
    backgroundColor: "green",
    height: "100%",
    padding: "0px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  });

  const chunkCardStyle = useRef({
    margin: "8px",
    transform: "translateY(8px)",
    height: "calc(100% - 16px)",
  });

  const { showOnboardingModal, dismissOnboardingModal } = onboarding;

  const playerDragHandler = useCallback(
    () => setPlayingChunk(undefined),
    [setPlayingChunk]
  );

  return (
    /* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/
    <Grid
      item
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{ height: "85%" }}
    >
      <Grid
        item
        container
        className={classes.backButtonContainer}
        xs={12}
        style={{ height: "10%", minHeight: "40px" }}
      >
        <BackButton action={atExit} />
      </Grid>
      <Grid
        item
        container
        alignContent="center"
        alignItems="center"
        xs={6}
        style={{ height: "50%", minHeight: "300px" }}
      >
        <VideoPlayer
          controller={videoPlayerController}
          progressState={videoPlayerProgressState}
          playerRef={playerRef}
          url={`${api_base_address}/api/watch/getvideo/${story_id}`}
          sliderMarks={marks}
          onProgressDrag={playerDragHandler}
        />
      </Grid>
      <Grid item container xs={12} style={{ height: "40%" }}>
        <GridList className={classes.chunksList} cellHeight="auto" cols={4.5}>
          {chunks
            .map((c) => (
              <GridListTile key={c.id}>
                <ScrollToOnMount>
                  <ChunkCard
                    chunk={c}
                    transcriptionIcon={
                      <ChunkCardContextMenu
                        menuItems={[
                          {
                            content: strings.delete,
                            handler: () => handleAttemptDeleteChunk(c),
                          },
                          {
                            content: strings.edit,
                            handler: () => setCroppingChunk(c),
                          },
                        ].concat(
                          c.transcriptions.length !== 0
                            ? [
                                {
                                  content: strings.viewTranscriptions,
                                  handler: () => setShowTranscriptionsFor(c),
                                },
                              ]
                            : []
                        )}
                      />
                    }
                  >
                    <div className={classes.chunkCardBody}>
                      <VideoThumbnail
                        url={`${api_base_address}/api/watch/getvideo/${story_id}`}
                        time={
                          c.starttimeseconds +
                          (c.endtimeseconds - c.starttimeseconds) / 2
                        }
                      />
                      <IndabaButton
                        round
                        color="primary"
                        style={playButtonStyle as React.CSSProperties}
                        onClick={() =>
                          handleChunkPlayButtonClick(
                            c,
                            playingChunk,
                            playingState[0]
                          )
                        }
                      >
                        {playingChunk?.id === c.id && playingState[0] ? (
                          <Stop />
                        ) : (
                          <PlayArrow />
                        )}
                      </IndabaButton>
                    </div>
                  </ChunkCard>
                </ScrollToOnMount>
              </GridListTile>
            ))
            .concat(
              getLastEndTimeSeconds(chunks) > 0.75
                ? [
                    <GridListTile
                      key={strings.doneCard}
                      onClick={handleCompleteChunking}
                    >
                      <ScrollToOnMount style={{ height: "100%" }}>
                        <SimpleCard
                          contentStyle={chunkCardContentStyle.current}
                          cardStyle={chunkCardStyle.current}
                        >
                          <Check
                            fontSize="large"
                            style={{ marginRight: "4px" }}
                          />
                        </SimpleCard>
                      </ScrollToOnMount>
                    </GridListTile>,
                  ]
                : []
            )}
        </GridList>
      </Grid>
      <div>
        <div className={classes.newChunkButtonContainer}>
          <IndabaButton
            round
            aria-label={strings.newChunk}
            style={{ margin: "20px" }}
            onClick={handleNewChunk}
          >
            <Add />
          </IndabaButton>
        </div>
      </div>
      <LoadingModal open={duration === 0} />
      <OnboardingModal
        show={showOnboardingModal}
        dismiss={dismissOnboardingModal}
        title={
          <h2 className={classes.onboardingTitle}>
            {strings.instructionsTitle}
          </h2>
        }
        steps={[
          strings.instructionsOne,
          strings.instructionsTwo,
          strings.instructionsThree,
          strings.instructionsFour,
        ]}
        stepsLabels={[
          strings.instructionOneStepLabel,
          strings.instructionTwoStepLabel,
          strings.instructionThreeStepLabel,
          strings.instructionFourStepLabel,
        ]}
        startButtonContent={<div>{strings.startChunking}</div>}
      />
      <EditChunkModal
        story_id={story_id}
        chunk={croppingChunk}
        exit={() => setCroppingChunk(undefined)}
        storyDuration={duration}
      />
      <ConfirmIntentModal
        actionControls={attemptDeleteActionControls}
        warningMessage={<div>{strings.attemptDeleteWarningTitle}</div>}
      >
        {(...args) => (
          <div style={{ overflowWrap: "anywhere" }}>
            {strings.formatString(
              strings.attemptDeleteWarningBody,
              args[0] && ` "${getNameOf(args[0])}"`
            )}
          </div>
        )}
      </ConfirmIntentModal>
      <ConfirmIntentModal
        actionControls={attemptNewChunkActionControls}
        warningMessage={<div>{strings.attemptNewChunkTitle}</div>}
      >
        {(...args) => (
          <div>
            {strings.formatString(
              strings.attemptNewChunkBody,
              getNameOf(getEnclosingChunk(args[0], args[1]) ?? args[0][0])
            )}
          </div>
        )}
      </ConfirmIntentModal>
      <TranscriptionsModal
        chunk={showTranscriptionsFor}
        exit={() => setShowTranscriptionsFor(undefined)}
      />
    </Grid>
  );
};

export default ChunkEditor;
