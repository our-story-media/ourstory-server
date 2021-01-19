// External Dependencies
import {
  Add,
  Close,
  Delete,
  Edit,
  History,
  Pause,
  PlayArrow,
} from "@material-ui/icons";
import React, {
  ChangeEvent,
  createContext,
  FormEvent,
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
  useCropChunk,
  useDeleteChunk,
  useNewChunk,
} from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import IndabaButton from "../IndabaButton/IndabaButton";
import { Chunk } from "../../utils/types";
import CentralModal from "../CentralModal/CentralModal";
import IndabaSlider from "../IndabaSlider/IndabaSlider";

type ChunkEditorProps = {
  /** Back button component */
  backButton: ReactNode;
};

const CropContext = createContext<[number, number]>([0, 0]);

const CropThumbComponent: React.FC<{}> = (props) => {
  return (
    <span
      {...props}
      style={{
        ...(props as any).style,
        transform:
          (props as any)["data-index"] === 1 ? "0" : "translateY(14px)",
        backgroundColor:
          (props as any)["data-index"] !== 1 ? "#f77965" : "#d9534f",
      }}
    >
      {(props as any)["data-index"] !== 1 ? (
        <div
          style={{
            height: "14px",
            width: "4px",
            transform: "translateY(-9px)",
            backgroundColor: "#f77965",
          }}
        />
      ) : null}
    </span>
  );
};

type ChunkCropperProps = {
  chunk: Chunk;
  exit: () => void;
  storyDuration: number;
};

const ChunkCropper: React.FC<ChunkCropperProps> = ({
  chunk,
  exit,
  storyDuration,
}) => {
  const {
    progressState: [cropPlayerProgress, setCropPlayerProgress],
    controller: cropPlayerController,
  } = useVideoPlayerController();

  const [videoSplit, setVideoSplit] = useState([0, 0] as [number, number]);
  const [croppedSplit, setCroppedSplit] = useState([0, 0] as [number, number]);

  /* Set initial state based on props  */
  useEffect(() => {
    setCropPlayerProgress(chunk.starttimeseconds);
    const start = chunk.starttimeseconds - 2 / storyDuration;
    const end = chunk.endtimeseconds + 2 / storyDuration;
    setVideoSplit([start < 0 ? 0 : start, end > 1 ? 1 : end]);
    setCroppedSplit([chunk.starttimeseconds, chunk.endtimeseconds]);
  }, [chunk.starttimeseconds, chunk.endtimeseconds, storyDuration]);

  const { userName } = useContext(UserContext);
  const cropChunk = useCropChunk();

  return (
    <div>
      <IndabaButton
        onClick={() => {
          userName && cropChunk(chunk, storyDuration, croppedSplit, userName);
          exit();
        }}
      >
        <Close />
      </IndabaButton>
      <VideoPlayer
        url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
        controller={cropPlayerController}
        slider={
          <CropContext.Provider value={croppedSplit}>
            <IndabaSlider
              value={[
                croppedSplit[0] * 100,
                cropPlayerProgress * 100,
                croppedSplit[1] * 100,
              ]}
              min={videoSplit[0] * 100}
              max={videoSplit[1] * 100}
              step={0.0001}
              ThumbComponent={CropThumbComponent}
              onChange={
                ((_: any, newValue: number | number[]) => {
                  setCroppedSplit([
                    (newValue as number[])[0] / 100,
                    (newValue as number[])[2] / 100,
                  ]);
                  setCropPlayerProgress((newValue as number[])[1] / 100);
                }) as ((
                  event: ChangeEvent<{}>,
                  value: number | number[]
                ) => void) &
                  ((event: FormEvent<HTMLSpanElement>) => void)
              }
            />
          </CropContext.Provider>
        }
      />
    </div>
  );
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

  return (
    /* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/
    <Box>
      <Container>
        <div>{backButton}</div>
      </Container>
      <CentralModal open={croppingChunk !== undefined}>
        <div>
          <ChunkCropper
            exit={() => setCroppingChunk(undefined)}
            storyDuration={duration}
            chunk={chunks[croppingChunk ? croppingChunk : 0]}
          />
        </div>
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
                  onClick={() => deleteChunk(c)}
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
