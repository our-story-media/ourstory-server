// External Dependencies
import { Box, Container, IconButton, TextField } from "@material-ui/core";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import React, { ReactNode, useContext, useState } from "react";

// Internal Dependencies
import { Chunk, StateSetter } from "../../utils/types";
import ChunkCard from "../ChunkCard/ChunkCard";
import { UserContext } from "../UserProvider/UserProvider";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useTranscribe from "./hooks/useTranscribe";
import useStyles from "./TranscriberStyles";

type TranscriberProps = {
  chunksState: [Chunk[], StateSetter<Chunk[]>];
  story_id: string;
  makeBackButton: (action: () => void) => ReactNode;
};

const Transcriber: React.FC<TranscriberProps> = ({
  chunksState,
  story_id,
  makeBackButton,
}) => {
  const [duration, setDuration] = useState(0);

  const [chunks] = chunksState;

  const [play, setPlay] = useState(false);

  const { userName } = useContext(UserContext);

  const {
    toNextChunk,
    toPrevChunk,
    disableNextChunk,
    disablePrevChunk,
    currentChunk,
    progressState,
    transcriptionState,
    updateChunk,
  } = useTranscribe(chunksState, userName);

  const backButton = makeBackButton(updateChunk);

  const classes = useStyles();

  const [transcription, setTranscription] = transcriptionState;

  return (
    <Container>
      {backButton}
      {chunks.length && (
        <>
          <Box className={classes.videoPlayerContainer}>
            <VideoPlayer
              durationState={[duration, setDuration]}
              progressState={progressState}
              playState={[play, setPlay]}
              url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
              split={{
                start: currentChunk.starttimeseconds,
                end: currentChunk.endtimeseconds,
              }}
            />
          </Box>
          <Box className={classes.transcribeControls}>
            <IconButton
              aria-label="Previous Chunk"
              style={{ color: "#FFFFFF" }}
              disabled={disablePrevChunk}
              onClick={toPrevChunk}
            >
              <NavigateBefore />
            </IconButton>
            <Box className={classes.transcriptionInput}>
              <ChunkCard chunk={currentChunk}>
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
            </Box>
            <IconButton
              aria-label="Next Chunk"
              style={{ color: "#FFFFFF" }}
              disabled={disableNextChunk}
              onClick={toNextChunk}
            >
              <NavigateNext />
            </IconButton>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Transcriber;
