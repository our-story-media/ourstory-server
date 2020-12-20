// External Dependencies
import { useEffect, useState } from "react";

// Internal Dependencies
import { Chunk } from "../../../utils/types";
import { ProgressState } from "../../VideoPlayer/Hooks/useVideoPlayerProgress";

const useTranscribe = (
  chunks: Chunk[]
): [() => void, () => void, boolean, boolean, Chunk, [ProgressState, React.Dispatch<React.SetStateAction<ProgressState>>]] => {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [progressState, setProgressState] = useState<ProgressState>({
    progress: 0,
    fromPlayer: true,
  });

  const toNextChunk = () => setCurrentChunkIndex((c) => c + 1);
  const toPrevChunk = () => setCurrentChunkIndex((c) => c - 1);
  const disableNextChunk = currentChunkIndex >= chunks.length - 1;
  const disablePrevChunk = currentChunkIndex <= 0;

  useEffect(() => {
    setProgressState({
      progress: chunks[currentChunkIndex].starttimeseconds,
      fromPlayer: false,
    });
  }, [currentChunkIndex, chunks]);

  return [toNextChunk, toPrevChunk, disableNextChunk, disablePrevChunk, chunks[currentChunkIndex], [progressState, setProgressState]];
};

export default useTranscribe;