// External Dependencies
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Internal Dependencies
import {
  getEnclosingChunk,
  getLastEndTimeSeconds,
  getLastEndTimeStamp,
  invalidSplit,
  toTimeStamp,
} from "../../..//utils/chunkManipulation";
import adjacentMap from "../../../utils/adjacentMap";
import { Chunk } from "../../../utils/types";
import { ProgressState } from "../../VideoPlayer/Hooks/useVideoPlayerProgress";

const useChunkEditing = (
  chunksState: [Chunk[], React.Dispatch<React.SetStateAction<Chunk[]>>],
  progressState: ProgressState,
  duration: null | number
): [() => void, (chunk: Chunk) => void] => {
  const [chunks, setChunks] = chunksState;

  const handleDeleteChunk = useCallback(
    (chunk: Chunk) =>
      // If the start and end don't match, extend the second one back to start at the first one
      setChunks((chunks) =>
        adjacentMap(
          chunks.filter((c) => c.id !== chunk.id),
          (a: Chunk, b: Chunk) => {
            if (a.endtimeseconds !== b.starttimeseconds) {
              return {
                ...b,
                starttimeseconds: a.endtimeseconds,
                starttimestamp: a.endtimestamp,
                id: uuidv4(),
                updatedat: new Date(),
              };
            }
            return b;
          }
        )
          .concat(
            ((first) =>
              first
                ? first.starttimeseconds === 0
                  ? [first]
                  : [
                      {
                        ...first,
                        starttimeseconds: 0,
                        starttimestamp: "00:00:00:00",
                        id: uuidv4(),
                        updatedat: new Date(),
                      },
                    ]
                : [])(chunks.filter((c) => c.id !== chunk.id)[0])
          )
          .sort((a, b) => a.endtimeseconds - b.endtimeseconds)
      ),
    [setChunks]
  );

  const handleNewChunk = useCallback(() => {
    const enclosingChunk = getEnclosingChunk(chunks, progressState.progress);
    if (invalidSplit(chunks, progressState.progress)) {
      return;
    } else if (enclosingChunk != null) {
      duration &&
        setChunks((chunks) =>
          chunks
            .filter((c) => c.id !== enclosingChunk.id)
            .concat([
              {
                starttimestamp: enclosingChunk.starttimestamp,
                starttimeseconds: enclosingChunk.starttimeseconds,
                endtimestamp: toTimeStamp(progressState.progress * duration),
                endtimeseconds: progressState.progress,
                creatorid: "test",
                updatedat: new Date(),
                id: uuidv4(),
              },
              {
                starttimestamp: toTimeStamp(progressState.progress * duration),
                starttimeseconds: progressState.progress,
                endtimestamp: enclosingChunk.endtimestamp,
                endtimeseconds: enclosingChunk.endtimeseconds,
                creatorid: "test",
                updatedat: new Date(),
                id: uuidv4(),
              },
            ])
            .sort((a, b) => a.endtimeseconds - b.endtimeseconds)
        );
    } else {
      duration &&
        setChunks(
          chunks.concat([
            {
              starttimestamp: getLastEndTimeStamp(chunks),
              endtimestamp: toTimeStamp(progressState.progress * duration),
              starttimeseconds: getLastEndTimeSeconds(chunks),
              endtimeseconds: progressState.progress,
              creatorid: "Test",
              updatedat: new Date(),
              id: uuidv4(),
            },
          ])
        );
    }
  }, [setChunks, chunks, progressState.progress, duration]);

  return [handleNewChunk, handleDeleteChunk];
};

export default useChunkEditing;
