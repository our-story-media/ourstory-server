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
import { Chunk, StateSetter } from "../../../utils/types";

const useChunkEditing = (
  chunksState: [Chunk[], StateSetter<Chunk[]>],
  progress: number,
  duration: null | number,
  userName: null | string
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
                transcriptions: [],
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
                        transcriptions: [],
                      },
                    ]
                : [])(chunks.filter((c) => c.id !== chunk.id)[0])
          )
          .sort((a, b) => a.endtimeseconds - b.endtimeseconds)
      ),
    [setChunks]
  );

  const handleNewChunk = useCallback(() => {
    const enclosingChunk = getEnclosingChunk(chunks, progress);
    if (invalidSplit(chunks, progress)) {
      return;
    } else if (enclosingChunk != null) {
      duration &&
        userName &&
        setChunks((chunks) =>
          chunks
            .filter((c) => c.id !== enclosingChunk.id)
            .concat([
              {
                starttimestamp: enclosingChunk.starttimestamp,
                starttimeseconds: enclosingChunk.starttimeseconds,
                endtimestamp: toTimeStamp(progress * duration),
                endtimeseconds: progress,
                creatorid: userName,
                updatedat: new Date(),
                id: uuidv4(),
                transcriptions: [],
              },
              {
                starttimestamp: toTimeStamp(progress * duration),
                starttimeseconds: progress,
                endtimestamp: enclosingChunk.endtimestamp,
                endtimeseconds: enclosingChunk.endtimeseconds,
                creatorid: userName,
                updatedat: new Date(),
                id: uuidv4(),
                transcriptions: [],
              },
            ])
            .sort((a, b) => a.endtimeseconds - b.endtimeseconds)
        );
    } else {
      duration &&
        userName &&
        setChunks(
          chunks.concat([
            {
              starttimestamp: getLastEndTimeStamp(chunks),
              endtimestamp: toTimeStamp(progress * duration),
              starttimeseconds: getLastEndTimeSeconds(chunks),
              endtimeseconds: progress,
              creatorid: userName,
              updatedat: new Date(),
              id: uuidv4(),
              transcriptions: [],
            },
          ])
        );
    }
  }, [setChunks, userName, chunks, progress, duration]);

  return [handleNewChunk, handleDeleteChunk];
};

export default useChunkEditing;
