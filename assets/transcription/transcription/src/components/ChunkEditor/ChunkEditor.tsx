// External Dependencies
import {
  Add,
  Check,
  Delete,
  Edit,
  Forward5,
  Pause,
  PlayArrow,
  Receipt,
  Replay5,
} from "@material-ui/icons";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, GridList, GridListTile, Mark } from "@material-ui/core";

// Internal Dependencies
import ChunkCard from "../SimpleCard/ChunkCard";
import useStyles from "./ChunkEditorStyles";
import story_id from "../../utils/getId";
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
import useWatchForNewElements from "../../hooks/useWatchForNewElements";
import ConfirmIntentModal from "../ConfirmIntentModal/ConfirmIntentModal";
import TranscriptionsModal from "../TranscriptionsModal/TranscriptionsModal";

type ChunkEditorProps = {
  /** Action to do when back button is pressed */
  atExit: () => void;
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

const ChunkEditor: React.FC<ChunkEditorProps> = ({ atExit }) => {
  const [chunks] = chunksContext.useChunksState();

  const {
    progressState: [progress, setProgress],
    playingState,
    duration,
    controller: videoPlayerController,
  } = useVideoPlayerController();

  const [, setPlay] = playingState;

  const marks = useMemo(() => getMarks(chunks), [chunks]);

  const { userName } = useContext(UserContext);

  const doWithChunks = useDoWithChunks();
  const deleteChunk = useDeleteChunk();
  const newChunk = useNewChunk();

  const classes = useStyles();

  const [playingChunk, setPlayingChunk] = useState<undefined | number>(
    undefined
  );

  useEffect(() => {
    if (
      playingChunk !== undefined &&
      progress > chunks[playingChunk].endtimeseconds
    ) {
      setPlayingChunk(undefined);
      setPlay(false);
    }
  }, [progress, playingChunk, chunks]);

  const handleChunkPlayButtonClick = useCallback(
    (
      chunkIdx: number,
      playingChunk: number | undefined,
      videoPlaying: boolean
    ) => {
      if (playingChunk === chunkIdx && videoPlaying) {
        setPlay(false);
      } else {
        setPlay(true);
        setPlayingChunk(chunkIdx);
        setProgress(chunks[chunkIdx].starttimeseconds);
      }
    },
    [chunks]
  );

  const [croppingChunk, setCroppingChunk] = useState<number | undefined>(
    undefined
  );

  /* We use these for auto scrolling to the new chunks,
   * as they are created
   */
  const [newEl, setNewEl] = useState("");
  const newElRef = useRef<any>();

  useWatchForNewElements(
    chunks,
    (a, b) => a.id === b.id,
    (newChunks) => {
      setNewEl(newChunks[newChunks.length - 1]?.id);
    }
  );

  useEffect(() => {
    newElRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [newEl]);

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

  return (
    /* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/
    <Box>
      <div style={{ marginTop: "4px" }}>
        <BackButton action={atExit} />
      </div>
      <EditChunkModal
        shown={croppingChunk !== undefined}
        chunk={chunks[croppingChunk ? croppingChunk : 0]}
        exit={() => setCroppingChunk(undefined)}
        storyDuration={duration}
      />
      <ConfirmIntentModal
        actionControls={attemptDeleteActionControls}
        warningMessage={<div>This Chunk has a transcription</div>}
      >
        {(...args) => (
          <div>
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
          url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
          sliderMarks={marks}
          onProgressDrag={() => setPlayingChunk(undefined)}
        />
      </div>
      <GridList className={classes.chunksList} cellHeight="auto" cols={2.5}>
        {chunks.map((c, idx) => (
          <GridListTile key={c.id} ref={c.id === newEl ? newElRef : null}>
            <ChunkCard
              chunk={c}
              transcriptionIcon={
                c.transcriptions.length === 0 ? undefined : (
                  <Receipt
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      margin: "6px",
                    }}
                    onClick={() => setShowTranscriptionsFor(c)}
                  />
                )
              }
            >
              <div style={{ marginTop: "8px" }}>
                <VideoThumbnail
                  url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
                  time={
                    c.starttimeseconds +
                    (c.endtimeseconds - c.starttimeseconds) / 2
                  }
                />
              </div>
              <IndabaButton
                round
                color="primary"
                style={{ marginRight: "4px" }}
                onClick={() =>
                  handleChunkPlayButtonClick(idx, playingChunk, playingState[0])
                }
              >
                {playingChunk === idx && playingState[0] ? (
                  <Pause />
                ) : (
                  <PlayArrow />
                )}
              </IndabaButton>
              <IndabaButton
                round
                aria-label="Delete Chunk"
                style={{ marginRight: "4px" }}
                onClick={() => {
                  doWithChunks((chunks: Chunk[]) => {
                    chunks.forEach(
                      (chunk) =>
                        chunk.id === c.id && attemptToDeleteChunk(chunk)
                    );
                  });
                }}
              >
                <Delete />
              </IndabaButton>
              <IndabaButton
                round
                aria-label="Edit Chunk"
                onClick={() => setCroppingChunk(idx)}
              >
                <Edit />
              </IndabaButton>
            </ChunkCard>
          </GridListTile>
        ))}
      </GridList>
      <div>
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            margin: "16px 16px 32px 16px",
            display: "flex",
          }}
        >
          <IndabaButton
            round
            aria-label="Go Back"
            style={{ margin: "8px" }}
            onClick={() => duration && setProgress(progress - 5 / duration)}
          >
            <Replay5 />
          </IndabaButton>
          <IndabaButton
            round
            aria-label="Go Forward"
            style={{ margin: "8px" }}
            onClick={() => duration && setProgress(progress + 5 / duration)}
          >
            <Forward5 />
          </IndabaButton>
        </div>
        <div
          style={{
            margin: "16px 16px 32px 16px",
            position: "absolute",
            bottom: 0,
            left: "50vw",
            transform: "translate(-50%)",
          }}
        >
          <IndabaButton
            onClick={handleCompleteChunking}
            style={{ margin: "8px", backgroundColor: "#40bf11" }}
          >
            <Check />
            <span style={{ marginLeft: "4px", fontSize: "1.05rem" }}>
              Complete
            </span>
          </IndabaButton>
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            margin: "16px 16px 32px 16px",
            display: "flex",
          }}
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
