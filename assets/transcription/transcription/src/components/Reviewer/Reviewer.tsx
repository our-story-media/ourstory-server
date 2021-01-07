import { Box, Checkbox, Container, IconButton, makeStyles } from "@material-ui/core";
import { Done } from "@material-ui/icons";
import React, { ReactNode } from "react";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import ChunkCard from "../ChunkCard/ChunkCard";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

interface ReviewerProps {
  backButton: ReactNode;
  story_id: string;
}

const useStyles = makeStyles({
  doneButton: {
    backgroundColor: "green",
    color: "white",
  },
});

export const Reviewer: React.FC<ReviewerProps> = ({ backButton, story_id }) => {
  const { controller: playerController } = useVideoPlayerController();

  const [chunks] = chunksContext.useChunksState();

  /*
   * Move Chunks to Context and use reducers
   *
   * Implement a reducer for updating the selected transcription on a chunk.
   * In this reducer, ensure that the newly ticked transcription is the only
   * ticked transcription
   */

  // const selectTranscript = (chunk: Chunk) => ()
  const classes = useStyles();

  return (
    <Container>
      {backButton}
      <Box>
        <VideoPlayer
          url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
          controller={playerController}
        />
      </Box>
      {chunks.map((c) => (
        <ChunkCard key={c.id} chunk={c}>
          <IconButton className={classes.doneButton}>
            <Done />
          </IconButton>
          <Checkbox style={{ backgroundColor: "initial" }} />
        </ChunkCard>
      ))}
    </Container>
  );
};
