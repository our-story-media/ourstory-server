import {
  Box,
  Checkbox,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { ReactNode, useMemo, useContext, useEffect } from "react";
import useSlideshow from "../../hooks/useSlideshow";
import {
  useDeleteReview,
  useUpdateReview,
} from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import ChunkCard from "../SimpleCard/ChunkCard";
import SimpleCard from "../SimpleCard/SimpleCard";
import Slideshow from "../Slideshow/Slideshow";
import { UserContext } from "../UserProvider/UserProvider";
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
  const {
    progressState: [, setProgress],
    splitState: [, setSplit],
    controller: playerController,
  } = useVideoPlayerController();

  const [chunks] = chunksContext.useChunksState();

  const classes = useStyles();

  const { page, goTo } = useSlideshow(chunks);

  const currentChunk = useMemo(() => chunks[page], [page, chunks]);

  useEffect(() => {
    setSplit({
      start: currentChunk.starttimeseconds,
      end: currentChunk.endtimeseconds,
    });
    setProgress(currentChunk.starttimeseconds);
  }, [currentChunk]);

  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const { userName } = useContext(UserContext);

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
            <Box
              className={classes.cardContainer}
              onClick={() =>
                userName &&
                (currentChunk.review?.selectedtranscription !== transcription.id
                  ? updateReview(currentChunk, transcription, userName)
                  : deleteReview(currentChunk))
              }
            >
              <SimpleCard
                title={
                  <h5 style={{ margin: "0" }}>{`${transcription.creatorid}'s Transcription`}</h5>
                }
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Checkbox
                    checked={
                      currentChunk.review?.selectedtranscription ===
                      transcription.id
                    }
                    onChange={(_, checked) =>
                      userName &&
                      (checked
                        ? updateReview(currentChunk, transcription, userName)
                        : deleteReview(currentChunk))
                    }
                    style={{ backgroundColor: "initial" }}
                  />
                  <Typography style={{ padding: "8px" }}>
                    {transcription.content}
                  </Typography>
                </div>
              </SimpleCard>
            </Box>
          ))}
        </ChunkCard>
      </Slideshow>
    </Container>
  );
};
