// External Dependencies
import { Add, Check, Stop, PlayArrow } from "@material-ui/icons";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
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
} from "../../utils/chunkManipulation";
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

  const doWithChunks = useDoWithChunks();
  const deleteChunk = useDeleteChunk();
  const newChunk = useNewChunk();

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

  const {
    attemptAction: attemptNewChunk,
    ...attemptNewChunkActionControls
  } = useConfirmBeforeAction(createNewChunk, (chunks, time) => {
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
    padding: "16px",
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

  const playerDragHandler = useCallback(() => setPlayingChunk(undefined), [
    setPlayingChunk,
  ]);

  return (
    /* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/
    <Box>
      <LoadingModal open={duration === 0} />
      <Container>
        <div className={classes.backButtonContainer}>
          <BackButton action={atExit} />
        </div>
      </Container>
      <OnboardingModal
        show={showOnboardingModal}
        dismiss={dismissOnboardingModal}
        title={
          <h2 className={classes.onboardingTitle}>Chunking Instructions</h2>
        }
        steps={[
          "You are about to chunk the video. The aim of chunking is to make Transcribing easy.",
          "Rather than transcribing the entire video at once, you will break the video down into smaller chunks, which you will transcribe individually.",
          "You should aim to have only one person speaking in each chunk. Create a new chunk when there is a change in who is talking, there is a gap in the talking, or a person begins/ends talking.",
          "To create a chunk, press the '+' button in the bottom right corner. The time that you press the '+' button in the video will be the end of the new chunk.",
        ]}
        startButtonContent={<div>Start Chunking</div>}
      />
      <EditChunkModal
        story_id={story_id}
        chunk={croppingChunk}
        exit={() => setCroppingChunk(undefined)}
        storyDuration={duration}
      />
      <ConfirmIntentModal
        actionControls={attemptDeleteActionControls}
        warningMessage={<div>This Chunk has a transcription</div>}
      >
        {(...args) => (
          <div style={{overflowWrap: "anywhere"}}>
            Attempting to delete chunk
            {args[0] && ` "${getNameOf(args[0])}"`}, which has a transcription
            saved to it. Are you sure you want to delete it?
          </div>
        )}
      </ConfirmIntentModal>
      <ConfirmIntentModal
        actionControls={attemptNewChunkActionControls}
        warningMessage={<div>The enclosing chunk has a transcription</div>}
      >
        {(...args) => (
          <div>
            Creating a new chunk here will delete the transcriptions on the
            enclosing chunk, "
            {getNameOf(getEnclosingChunk(args[0], args[1]) ?? args[0][0])}
            ". Are you sure you want to discard these transcriptions?
          </div>
        )}
      </ConfirmIntentModal>
      <TranscriptionsModal
        chunk={showTranscriptionsFor}
        exit={() => setShowTranscriptionsFor(undefined)}
      />
      <div className={classes.videoPlayerContainer}>
        <VideoPlayer
          controller={videoPlayerController}
          progressState={videoPlayerProgressState}
          playerRef={playerRef}
          url={`http://${api_base_address}:8845/api/watch/getvideo/${story_id}`}
          sliderMarks={marks}
          onProgressDrag={playerDragHandler}
        />
      </div>
      <GridList className={classes.chunksList} cellHeight="auto" cols={2.5}>
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
                          content: "Delete",
                          handler: () => handleAttemptDeleteChunk(c),
                        },
                        {
                          content: "Edit",
                          handler: () => setCroppingChunk(c),
                        },
                      ].concat(
                        c.transcriptions.length !== 0
                          ? [
                              {
                                content: "View Transcriptions",
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
                      url={`http://${api_base_address}:8845/api/watch/getvideo/${story_id}`}
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
                    key="Done Card"
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
      <div>
        <div
          className={classes.newChunkButtonContainer}
        >
          <IndabaButton
            round
            aria-label="New Chunk"
            style={{ margin: "8px" }}
            onClick={handleNewChunk}
          >
            <Add />
          </IndabaButton>
        </div>
      </div>
    </Box>
  );
};

export default ChunkEditor;
