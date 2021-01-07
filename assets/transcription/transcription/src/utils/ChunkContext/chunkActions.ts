// External Dependencies
import { v4 as uuidv4 } from "uuid";

// Internal Dependencies
import adjacentMap from "../adjacentMap";
import {
  getEnclosingChunk,
  getLastEndTimeSeconds,
  getLastEndTimeStamp,
  invalidSplit,
  toTimeStamp,
} from "../chunkManipulation";
import { Chunk } from "../types";
import store from "./store";

export const useDeleteChunk = () => {
  const [, setChunks] = store.useStore();

  return (toDelete: Chunk) =>
    setChunks((chunks) =>
      adjacentMap(
        chunks.filter((c) => c.id !== toDelete.id),
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
              : [])(chunks.filter((c) => c.id !== toDelete.id)[0])
        )
        .sort((a, b) => a.endtimeseconds - b.endtimeseconds)
    );
};

export const useNewChunk = () => {
  const [chunks, setChunks] = store.useStore();

  return (splitAt: number, storyDuration: number, userName: string | null) => {
    if (invalidSplit(chunks, splitAt)) {
      return;
    }
    const enclosingChunk = getEnclosingChunk(chunks, splitAt);
    if (enclosingChunk != null) {
      storyDuration &&
        userName &&
        setChunks((chunks) =>
          chunks
            .filter((c) => c.id !== enclosingChunk.id)
            .concat([
              {
                starttimestamp: enclosingChunk.starttimestamp,
                starttimeseconds: enclosingChunk.starttimeseconds,
                endtimestamp: toTimeStamp(splitAt * storyDuration),
                endtimeseconds: splitAt,
                creatorid: userName,
                updatedat: new Date(),
                id: uuidv4(),
                transcriptions: [],
              },
              {
                starttimestamp: toTimeStamp(splitAt * storyDuration),
                starttimeseconds: splitAt,
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
      storyDuration &&
        userName &&
        setChunks(
          chunks.concat([
            {
              starttimestamp: getLastEndTimeStamp(chunks),
              endtimestamp: toTimeStamp(splitAt * storyDuration),
              starttimeseconds: getLastEndTimeSeconds(chunks),
              endtimeseconds: splitAt,
              creatorid: userName,
              updatedat: new Date(),
              id: uuidv4(),
              transcriptions: [],
            },
          ])
        );
    }
  };
};
