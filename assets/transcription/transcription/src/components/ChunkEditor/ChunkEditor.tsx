// External Dependencies
import { Add, Delete, History, PlayArrow } from "@material-ui/icons";
import React, { ReactNode, useContext } from "react";
import { Button, Container, IconButton } from "@material-ui/core";

// Internal Dependencies
import ChunkCard from "../ChunkCard/ChunkCard";
import useStyles from "./ChunkEditorStyles";
import story_id from "../../utils/getId";
import { UserContext } from "../UserProvider/UserProvider";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import { useDeleteChunk, useNewChunk } from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";

type ChunkEditorProps = {
  /** Back button component */
  backButton: ReactNode;
};

const ChunkEditor: React.FC<ChunkEditorProps> = ({
  backButton,
}) => {
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

  return (
    /* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/
    <Container>
      {backButton}
      <div className={classes.videoPlayerContainer}>
        <VideoPlayer
          controller={videoPlayerController}
          url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
        />
      </div>
      <IconButton
        aria-label="Go Back"
        style={{ color: "#FFFFFF" }}
        className={classes.actionButton}
        onClick={() => duration && setProgress(progress - 5 / duration)}
      >
        <History />
      </IconButton>
      <IconButton
        aria-label="New Chunk"
        style={{ color: "#FFFFFF" }}
        className={classes.actionButton}
        onClick={() => userName && newChunk(progress, duration, userName)}
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
                setProgress(c.starttimeseconds);
              }}
            >
              <PlayArrow />
            </Button>
            <Button
              aria-label="Delete Chunk"
              style={{ color: "#FFFFFF" }}
              onClick={() => deleteChunk(c)}
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
