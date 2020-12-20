// External Dependencies
import { Box, Container, IconButton, TextField } from "@material-ui/core";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

// Internal Dependencies
import { Chunk } from "../../utils/types";
import ChunkCard from "../ChunkCard/ChunkCard";
import { ProgressState } from "../VideoPlayer/Hooks/useVideoPlayerProgress";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

type TranscriberProps = {
  chunks: Chunk[];
  story_id: string;
};

const Transcriber: React.FC<TranscriberProps> = ({ chunks, story_id }) => {
  const [duration, setDuration] = useState(0);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [progressState, setProgressState] = useState<ProgressState>({
    progress: 0,
    fromPlayer: true,
  });
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setProgressState({ progress: chunks[currentChunk].starttimeseconds, fromPlayer: false })
  }, [currentChunk]);
  return (
    <Container>
      {chunks.length && (
        <>
          <VideoPlayer
            durationState={[duration, setDuration]}
            progressState={[progressState, setProgressState]}
            playState={[play, setPlay]}
            url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
            split={{
              start: chunks[currentChunk].starttimeseconds,
              end: chunks[currentChunk].endtimeseconds,
            }}
          />
          <IconButton
            aria-label="Previous Chunk"
            style={{ color: "#FFFFFF" }}
            disabled={currentChunk <= 0}
            onClick={() => setCurrentChunk((c) => c - 1)}
          >
            <NavigateBefore />
          </IconButton>

          <IconButton
            aria-label="Next Chunk"
            style={{ color: "#FFFFFF" }}
            disabled={currentChunk >= chunks.length - 1}
            onClick={() => setCurrentChunk((c) => c + 1)}
          >
            <NavigateNext />
          </IconButton>
          <ChunkCard chunk={chunks[currentChunk]}>
            <TextField style={{ width: "100%" }} label="Transcription" />
          </ChunkCard>
        </>
      )}
    </Container>
  );
};

export default Transcriber;
