// External Dependencies
import { Add, Delete, History, Pause, PlayArrow } from "@material-ui/icons";
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
  useNewChunk,
} from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import IndabaButton from "../IndabaButton/IndabaButton";
import { Chunk } from "../../utils/types";

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

  /**
   * TODO
   * =======
   * - Modify play chunk behaviour so that it stops when the chunk ends
   * - Modify play chunk behaviour so that the chunk play button reflects the
   *   state of the player
   */

  const marks = useMemo(() => getMarks(chunks), [chunks]);

  const [playingChunk, setPlayingChunk] = useState<undefined | number>(
    undefined
  );

  useEffect(() => {
    if (playingChunk && progress > chunks[playingChunk].endtimeseconds) {
      setPlayingChunk(undefined);
      setPlay(false);
    }
  }, [progress, playingChunk, chunks]);

  const handleChunkPlayButtonClick = useCallback(
    (chunkIdx: number, playingChunk: number | undefined) => {
      if (playingChunk === chunkIdx && playingState) {
        setPlay(false);
      } else {
        setPlay(true);
        setPlayingChunk(chunkIdx);
        setProgress(chunks[chunkIdx].starttimeseconds);
      }
    },
    [chunks]
  );

  return (
    /* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/
    <Box>
      <Container>
        <div>{backButton}</div>
      </Container>
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
                  style={{ marginRight: "4px", color: "#FFFFFF" }}
                  onClick={() => handleChunkPlayButtonClick(idx, playingChunk)}
                >
                  {playingChunk === idx && playingState ? (
                    <Pause />
                  ) : (
                    <PlayArrow />
                  )}
                </IndabaButton>
                <IndabaButton
                  round
                  aria-label="Delete Chunk"
                  style={{ color: "#FFFFFF" }}
                  onClick={() => deleteChunk(c)}
                >
                  <Delete />
                </IndabaButton>
              </ChunkCard>
            </GridListTile>
          ))}
        </GridList>
        <IndabaButton
          round
          aria-label="Go Back"
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            margin: "16px 16px 40px 16px",
          }}
          onClick={() => duration && setProgress(progress - 5 / duration)}
        >
          <History />
        </IndabaButton>
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
