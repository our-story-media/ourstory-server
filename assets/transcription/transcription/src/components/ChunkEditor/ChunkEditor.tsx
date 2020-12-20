// External Dependencies
import { Add, Delete, History, PlayArrow } from "@material-ui/icons";
import React, { useState } from "react";
import { Button, Container, IconButton } from "@material-ui/core";

// Internal Dependencies
import ChunkCard from "../ChunkCard/ChunkCard";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useStyles from "./ChunkEditorStyles";
import { Chunk } from "../../utils/types";
import story_id from "../../utils/getId";
import { ProgressState } from "../VideoPlayer/Hooks/useVideoPlayerProgress";
import useChunkEditing from "./hooks/useChunkEditing";

type ChunkEditorProps = {
  /** State for the story chunks */
  chunksState: [Chunk[], React.Dispatch<React.SetStateAction<Chunk[]>>];
};

const ChunkEditor: React.FC<ChunkEditorProps> = ({ chunksState }) => {
  const [play, setPlay] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [chunks, setChunks] = chunksState;
  const [progressState, setProgressState] = useState<ProgressState>({
    progress: 0,
    fromPlayer: true,
  });

  const [handleNewChunk, handleDeleteChunk] = useChunkEditing([chunks, setChunks], progressState, duration);
  
  const classes = useStyles();

  return (
    /* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/
    <Container>
      <div className={classes.videoPlayerContainer}>
        <VideoPlayer
          durationState={[duration, setDuration]}
          progressState={[progressState, setProgressState]}
          playState={[play, setPlay]}
          url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
        />
      </div>
      <IconButton
        aria-label="Go Back"
        style={{ color: "#FFFFFF" }}
        className={classes.actionButton}
        onClick={() =>
          duration && setProgressState({
            progress: progressState.progress - 5 / duration,
            fromPlayer: false,
          })
        }
      >
        <History />
      </IconButton>
      <IconButton
        aria-label="New Chunk"
        style={{ color: "#FFFFFF" }}
        className={classes.actionButton}
        onClick={handleNewChunk}
      >
        <Add />
      </IconButton>
      <div className={classes.chunksContainer}>
        {chunks.map((c) => (
          <ChunkCard key={c.id} chunk={c}>
            <Button
              style={{ marginRight: "4px", color: "#FFFFFF" }}
              onClick={() => {
                setPlay(true);
                setProgressState({
                  progress: c.starttimeseconds,
                  fromPlayer: false,
                });
              }}
            >
              <PlayArrow />
            </Button>
            <Button
              aria-label="Delete Chunk"
              style={{ color: "#FFFFFF" }}
              onClick={() => handleDeleteChunk(c)}
            >
              <Delete />
            </Button>
          </ChunkCard>
        ))}
      </div>
    </Container>
  );
};

export default ChunkEditor;
