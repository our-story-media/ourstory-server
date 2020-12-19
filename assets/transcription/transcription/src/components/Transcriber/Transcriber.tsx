// External Dependencies
import { Container } from "@material-ui/core";
import React, { useState } from "react";

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
  return (
    <Container>
      <VideoPlayer
        setDuration={setDuration}
        progressState={[progressState, setProgressState]}
        playState={[play, setPlay]}
        url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
      />
      <ChunkCard chunk={chunks[currentChunk]} onPlay={() => console.log("played")}/>
    </Container>
  );
};

export default Transcriber;
