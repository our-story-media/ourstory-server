// External Dependencies
import { Box, Container, TextField } from "@material-ui/core";
import React, { ReactNode, useContext, useEffect, useState } from "react";

// Internal Dependencies
import oneSatisfies from "../../utils/oneSatisfies";
import { Chunk } from "../../utils/types";
import ChunkCard from "../SimpleCard/ChunkCard";
import { UserContext } from "../UserProvider/UserProvider";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useStyles from "./TranscriberStyles";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import useSlideshow from "../../hooks/useSlideshow";
import { useUpdateTranscription } from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import Slideshow from "../Slideshow/Slideshow";

const getUsersTranscription = (chunk: Chunk, userName: string): string =>
  oneSatisfies(chunk.transcriptions, (t) => t.creatorid === userName)
    ? chunk.transcriptions.filter((t) => t.creatorid === userName)[0].content
    : "";

type TranscriberProps = {
  story_id: string;
  makeBackButton: (action: () => void) => ReactNode;
};

const Transcriber: React.FC<TranscriberProps> = ({
  story_id,
  makeBackButton,
}) => {
  const [chunks] = chunksContext.useChunksState();

  const {
    progressState: [, setProgress],
    splitState: [, setSplit],
    duration,
    controller,
  } = useVideoPlayerController();

  const { userName } = useContext(UserContext);

  const [transcription, setTranscription] = useState("");

  const { page, goTo } = useSlideshow(chunks);

  useEffect(() => {
    userName && setTranscription(getUsersTranscription(chunks[page], userName));
    setSplit({
      start: chunks[page].starttimeseconds,
      end: chunks[page].endtimeseconds,
    });
    setProgress(chunks[page].starttimeseconds);
  }, [chunks, page, userName]);

  const updateTranscription = useUpdateTranscription();

  const backButton = makeBackButton(
    () => userName && updateTranscription(chunks[page], transcription, userName)
  );

  const classes = useStyles();

  return (
    <Container>
      {backButton}
      {chunks.length && (
        <>
          <Box className={classes.videoPlayerContainer}>
            <VideoPlayer url={`http://localhost:8845/api/watch/getvideo/${story_id}`} controller={controller}/>
          </Box>
          <Slideshow
            onNavBack={() => {
              userName &&
                updateTranscription(chunks[page], transcription, userName);
              goTo("prev");
            }}
            onNavForward={() => {
              userName &&
                updateTranscription(chunks[page], transcription, userName);
              goTo("next");
            }}
            currentPage={page}
            numberOfPages={chunks.length}
          >
            <ChunkCard chunk={chunks[page]}>
              <TextField
                multiline
                className={classes.inputField}
                variant="outlined"
                rows={3}
                label="Transcription"
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
              />
            </ChunkCard>
          </Slideshow>
        </>
      )}
    </Container>
  );
};

export default Transcriber;
