// External Dependencies
import {
  Add,
  Delete,
  Edit,
  Forward5,
  Pause,
  PlayArrow,
  Replay5,
} from "@material-ui/icons";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Container,
  GridList,
  GridListTile,
  Mark,
  TextField,
} from "@material-ui/core";

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
import { Chunk, State } from "../../utils/types";
import CentralModal from "../CentralModal/CentralModal";
import ChunkCropper from "./ChunkCropper";
import { getNameOf, hasTranscription } from "../../utils/chunkManipulation";
import EditChunkModal from "../EditChunkModal/EditChunkModal";

type ChunkEditorProps = {
  /** Back button component */
  backButton: ReactNode;
};

/**
 * Helper function that converts a list of chunks
 * to a list of marks
 *
 * @param chunks the chunks to get the marks for
 */
const getMarks = (chunks: Chunk[]): Mark[] =>
  chunks.map((chunk) => ({ value: chunk.endtimeseconds * 100 }));

const ChunkEditor: React.FC<ChunkEditorProps> = ({ backButton }) => {
  const [chunks] = chunksContext.useChunksState();

  const {
    progressState: [progress, setProgress],
    playingState,
    duration,
    controller: videoPlayerController,
  } = useVideoPlayerController();

  const { userName } = useContext(UserContext);

  const [, setPlay] = playingState;

  const deleteChunk = useDeleteChunk();
  const newChunk = useNewChunk();

  const classes = useStyles();

  const marks = useMemo(() => getMarks(chunks), [chunks]);

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

  const doWithChunks = useDoWithChunks();

  const [attemptingToDeleteChunk, setAttemptingToDeleteChunk] = useState<
    Chunk | undefined
  >(undefined);

  return (
    /* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/
    <Box>
      <Container>
        <div>{backButton}</div>
      </Container>
      <EditChunkModal
        shown={croppingChunk !== undefined}
        chunk={chunks[croppingChunk ? croppingChunk : 0]}
        exit={() => setCroppingChunk(undefined)}
        storyDuration={duration}
      />
      <CentralModal
        open={attemptingToDeleteChunk !== undefined}
        exit={() => setAttemptingToDeleteChunk(undefined)}
        header={
          <div>
            Attempting to delete chunk
            {attemptingToDeleteChunk && getNameOf(attemptingToDeleteChunk)}
          </div>
        }
      >
        <div>Warning! This Chunk has a transcription</div>
      </CentralModal>
      <div className={classes.videoPlayerContainer}>
        <VideoPlayer
          controller={videoPlayerController}
          url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
          sliderMarks={marks}
          onProgressDrag={() => setPlayingChunk(undefined)}
        />
      </div>
      <Container>
        <GridList className={classes.chunksList} cellHeight="auto" cols={2.5}>
          {chunks.map((c, idx) => (
            <GridListTile key={c.id}>
              <ChunkCard chunk={c}>
                <IndabaButton
                  round
                  color="primary"
                  style={{ marginRight: "4px" }}
                  onClick={() =>
                    handleChunkPlayButtonClick(
                      idx,
                      playingChunk,
                      playingState[0]
                    )
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
                    console.log(hasTranscription(c));
                    doWithChunks((chunks: Chunk[]) => {
                      chunks.forEach(
                        (chunk) =>
                          chunk.id === c.id &&
                          (hasTranscription(chunk) ?
                          setAttemptingToDeleteChunk(chunk) : deleteChunk(chunk))
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
        <IndabaButton
          round
          aria-label="New Chunk"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            margin: "16px 16px 40px 16px",
          }}
          onClick={() => userName && newChunk(progress, duration, userName)}
        >
          <Add />
        </IndabaButton>
      </Container>
    </Box>
  );
};

export default ChunkEditor;
