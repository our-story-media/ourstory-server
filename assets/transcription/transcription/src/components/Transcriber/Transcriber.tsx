// External Dependencies
import { Box, Container, IconButton, TextField } from "@material-ui/core";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Internal Dependencies
import { Chunk } from "../../utils/types";
import ChunkCard from "../ChunkCard/ChunkCard";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useTranscribe from "./hooks/useTranscribe";
import useStyles from "./TranscriberStyles";

type TranscriberProps = {
  chunksState: [Chunk[], React.Dispatch<React.SetStateAction<Chunk[]>>];
  story_id: string;
};

const Transcriber: React.FC<TranscriberProps> = ({ chunksState, story_id }) => {
  const [duration, setDuration] = useState(0);

  const [chunks, setChunks] = chunksState;

  const [play, setPlay] = useState(false);

  // State for what is in the Input field
  const [transcription, setTranscription] = useState<null | string>(null);

  const currentUserId = "Test";

  const [
    toNextChunk,
    toPrevChunk,
    disableNextChunk,
    disablePrevChunk,
    currentChunk,
    progressState,
  ] = useTranscribe(chunks);

  useEffect(() => {
    currentChunk.transcriptions.filter((el) => el.creatorid != currentUserId);
  }, [currentChunk]);

  const classes = useStyles();

  const updateChunk = useCallback(() => {
    setChunks((chunks) =>
      chunks.map((c) =>
        transcription && c.id === currentChunk.id
          ? {
              ...c,
              transcriptions: c.transcriptions.concat([
                {
                  creatorid: "Test",
                  content: transcription,
                  id: uuidv4(),
                  updatedat: new Date(),
                },
              ]),
            }
          : c
      )
    );
  }, [transcription, setChunks, currentChunk.id]);

  useEffect(() => {
    return updateChunk;
  }, [updateChunk, currentChunk]);

  return (
    <Container>
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
