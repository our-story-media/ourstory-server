// External Dependencies
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Internal Dependencies
import adjacentMap from "../adjacentMap";
import {
  getAdjacentChunks,
  getEnclosingChunk,
  getLastEndTimeSeconds,
  getLastEndTimeStamp,
  invalidSplit,
  toTimeStamp,
  removeReview,
  getTranscriptionByCreator,
  renameChunk,
  deleteNegativeChunks
} from "../chunkManipulation/chunkManipulation";
import oneSatisfies from "../oneSatisfies";
import { Chunk, Transcription } from "../types";

/**
 * Get a function for deleting chunks
 */
export const useDeleteChunk = (
  setChunks: (setter: (newState: Chunk[]) => Chunk[]) => void
): ((toDelete: Chunk) => void) => {
  /**
   * Delete a chunk from the chunks in the ChunksContext
   *
   * @param toDelete - the chunk to delete
   */
  const deleteFn = useCallback(
    (toDelete: Chunk) =>
      setChunks((chunks) =>
        /*
      This call to adjacentMap is checking if, after deleting the chunk, there
      is a gap in the chunks. If so, we need to create a new chunk that closes
      the gap

      At a high level:
      If we have chunks A B C D, and we delete chunk B we now have a gap
      between chunks A and C. To fix this, we need to create a new chunk
      that has the same start time as A and the same end time as C,
      so we end up with: E D, where E is a new chunk that we create in this
      call to adjacentMap
      */
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
      ),
    [setChunks]
  );

  return deleteFn;
};

/**
 * Get a function for creating new chunks
 */
export const useNewChunk = (
  setChunks: (setter: (newState: Chunk[]) => Chunk[]) => void
): ((splitAt: number, storyDuration: number, userName: string) => void) => {
  /**
   * This function creates a new chunk in the video.
   * Invalid chunks are defined by the invalidSplit function and will not be created
   *
   * @param splitAt - the point in the video (as a fraction) where the new chunk should end
   * @param storyDuration - the length of the video being chunked
   * @param userName - the name of the user doing the chunking
   */
  const newChunkFn = useCallback(
    (splitAt: number, storyDuration: number, userName: string) => {
      setChunks((chunks) => {
        if (invalidSplit(chunks, splitAt, storyDuration)) {
          return chunks;
        }
        const enclosingChunk = getEnclosingChunk(chunks, splitAt);
        if (enclosingChunk !== undefined) {
          const newChunks = chunks
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
            .sort((a, b) => a.endtimeseconds - b.endtimeseconds);
          return newChunks;
        } else {
          const newChunks = chunks.concat([
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
          ]);

          return newChunks;
        }
      });
    },
    [setChunks]
  );

  return newChunkFn;
};

/**
 * Get a function for updating a chunks transcription
 * list. Passing an empty string as 'updatedTranscription' deletes the transcription
 */
export const useUpdateTranscription = (
  setChunks: (setter: (newState: Chunk[]) => Chunk[]) => void
): ((
  toUpdate: Chunk,
  updatedTranscription: string,
  userName: string
) => void) => {
  const updateFunction = useCallback(
    (toUpdate: Chunk, updatedTranscription: string, userName: string) => {
      setChunks((chunks) => {
        const newChunks = chunks.map((chunk) =>
          chunk.id === toUpdate.id
            ? {
                ...(chunk.review?.selectedtranscription ===
                  getTranscriptionByCreator(chunk, userName)?.id &&
                updatedTranscription === ""
                  ? removeReview(chunk)
                  : chunk),
                /* This call to oneSatisfies checks if the current user has
                 * already made a transcription for this chunk (in that case,
                 * update that chunk instead of creating a new one)
                 */
                transcriptions: oneSatisfies(
                  chunk.transcriptions,
                  (t) => t.creatorid === userName
                )
                  ? /* The ternary here is to delete a transcription if a user has a transcription but is now transcribing an empty string */
                    updatedTranscription === ""
                    ? chunk.transcriptions.filter(
                        (t) => t.creatorid !== userName
                      )
                    : chunk.transcriptions.map((t) =>
                        t.creatorid === userName
                          ? {
                              ...t,
                              content: updatedTranscription,
                              updatedat: new Date(),
                            }
                          : t
                      )
                  : /* The ternary here is to avoid adding empty transcriptions */
                    chunk.transcriptions.concat(
                      updatedTranscription === ""
                        ? []
                        : [
                            {
                              creatorid: userName,
                              content: updatedTranscription,
                              id: uuidv4(),
                              updatedat: new Date(),
                            },
                          ]
                    ),
              }
            : chunk
        );
        return newChunks;
      });
    },
    [setChunks]
  );

  return updateFunction;
};

/**
 * Get a function for updating the Review of a Chunk
 */
export const useUpdateReview = (
  setChunks: (setter: (newState: Chunk[]) => Chunk[]) => void
): ((
  toUpdate: Chunk,
  selectedTranscription: Transcription,
  userName: string
) => void) => {
  const updateFn = useCallback(
    (
      toUpdate: Chunk,
      selectedTranscription: Transcription,
      userName: string
    ) => {
      setChunks((chunks) =>
        chunks.map((chunk) =>
          chunk.id === toUpdate.id
            ? /*
               * This call to oneSatisfies simply checks if the
               * selectedTranscription exists on the Chunk
               * (if it doesn't, don't update the chunk)
               */
              oneSatisfies(
                chunk.transcriptions,
                (a) => a.id === selectedTranscription.id
              )
              ? {
                  ...chunk,
                  review: {
                    reviewedat: new Date(),
                    selectedtranscription: selectedTranscription.id,
                    reviewedby: userName,
                  },
                }
              : chunk
            : chunk
        )
      );
    },
    [setChunks]
  );

  return updateFn;
};

/**
 * Get a function for deleting the Review of a Chunk
 */
export const useDeleteReview = (
  setChunks: (setter: (newState: Chunk[]) => Chunk[]) => void
): ((toDelete: Chunk) => void) => {
  const deleteFn = useCallback(
    (toDelete: Chunk) => {
      setChunks((chunks) =>
        chunks.map((chunk) =>
          chunk.id === toDelete.id ? { ...chunk, review: undefined } : chunk
        )
      );
    },
    [setChunks]
  );

  return deleteFn;
};

/**
 * Hook for getting a function for cropping a chunk
 *
 * This involves modifying the start and end times
 * of the cropped chunk as well as the chunks on either
 * side of the chunk.
 *
 * The user may also, optionally, rename the chunk using
 * this action
 */
export const useCropChunk = (
  setChunks: (setter: (newState: Chunk[]) => Chunk[]) => void
): ((
  toUpdate: Chunk,
  storyDuration: number,
  newSplit: [number, number],
  userName: string,
  newName?: string | undefined
) => void) => {
  const cropFn = useCallback(
    (
      toUpdate: Chunk,
      storyDuration: number,
      newSplit: [number, number],
      userName: string,
      newName?: string
    ) => {
      setChunks((chunks) => {
        const neighbouringChunks = getAdjacentChunks(toUpdate, chunks);
        return deleteNegativeChunks(
          chunks
            .map((chunk) =>
              chunk.id === toUpdate.id
                ? {
                    ...(newName
                      ? renameChunk(newName, chunk)
                      : { ...chunk, name: undefined }),
                    starttimeseconds: newSplit[0],
                    starttimestamp: toTimeStamp(newSplit[0] * storyDuration),
                    endtimeseconds: newSplit[1],
                    endtimestamp: toTimeStamp(newSplit[1] * storyDuration),
                    updatedat: new Date(),
                  }
                : chunk.id === neighbouringChunks.next?.id
                ? {
                    ...chunk,
                    starttimeseconds: newSplit[1],
                    starttimestamp: toTimeStamp(newSplit[1] * storyDuration),
                    updatedat: new Date(),
                  }
                : chunk.id === neighbouringChunks.prev?.id
                ? {
                    ...chunk,
                    endtimeseconds: newSplit[0],
                    endtimestamp: toTimeStamp(newSplit[0] * storyDuration),
                    updatedat: new Date(),
                  }
                : chunk
            )
            /*
             * This is the case where the chunk the user is editing is the first
             * chunk, and they are editing it so that it doesn't start at the very
             * start. In this case, we need a new chunk to cover this gap
             */
            .concat(
              !neighbouringChunks.prev && newSplit[0] !== 0
                ? [
                    {
                      starttimestamp: toTimeStamp(0),
                      starttimeseconds: 0,
                      endtimestamp: toTimeStamp(newSplit[0] * storyDuration),
                      endtimeseconds: newSplit[0],
                      creatorid: userName,
                      updatedat: new Date(),
                      id: uuidv4(),
                      transcriptions: [],
                    },
                  ]
                : []
            )
        ).sort((a, b) => a.endtimeseconds - b.endtimeseconds);
      });
    },
    [setChunks]
  );

  return cropFn;
};

/**
 * Hook to get a function that accepts a function
 * and calls that function with the latest chunks
 * according to the server
 */
export const useDoWithChunks = (
  setChunks: (setter: (newState: Chunk[]) => Chunk[]) => void
): ((doWith: (chunks: Chunk[]) => void) => void) => {
  const doWithFn = useCallback(
    (doWith: (chunks: Chunk[]) => void) => {
      setChunks((chunks) => {
        doWith(chunks);
        return chunks;
      });
    },
    [setChunks]
  );

  return doWithFn;
};
