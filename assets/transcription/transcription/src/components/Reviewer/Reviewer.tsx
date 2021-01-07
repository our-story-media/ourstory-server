import {
  Box,
  Checkbox,
  Container,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { Done } from "@material-ui/icons";
import React, { ReactNode, useMemo } from "react";
import useSlideshow from "../../hooks/useSlideshow";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import ChunkCard from "../SimpleCard/ChunkCard";
import SimpleCard from "../SimpleCard/SimpleCard";
import Slideshow from "../Slideshow/Slideshow";
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
  cardContainer: {
    marginTop: "8px",
    marginBottom: "8px",
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

  const { page, goTo } = useSlideshow(chunks);

  const currentChunk = useMemo(() => chunks[page], [page, chunks]);

  return (
    <Container>
      {backButton}
      <Box>
        <VideoPlayer
          url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
          controller={playerController}
        />
      </Box>
      <Slideshow
        currentPage={page}
        onNavForward={() => goTo("next")}
        onNavBack={() => goTo("prev")}
        numberOfPages={chunks.length}
      >
        <ChunkCard key={currentChunk.id} chunk={currentChunk}>
          {currentChunk.transcriptions.map((transcription) => (
            <Box className={classes.cardContainer}>
              <SimpleCard title={<h5 style={{margin: "0"}}>{transcription.creatorid}</h5>}>
                <Checkbox style={{ backgroundColor: "initial" }} />
                {transcription.content}
              </SimpleCard>
            </Box>
          ))}
        </ChunkCard>
      </Slideshow>
    </Container>
  );
};
