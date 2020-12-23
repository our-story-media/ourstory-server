// External Dependencies
import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import oneSatisfies from "../../../utils/oneSatisfies";

// Internal Dependencies
import { Chunk, StateSetter } from "../../../utils/types";
import { ProgressState } from "../../VideoPlayer/Hooks/useVideoPlayerProgress";

enum ChunkIndexActionType {
  NextChunk,
  PreviousChunk,
}

type ChunkIndexReducerAction = {
  type: ChunkIndexActionType;
  payload: { newTranscription: string; userName: string };
};

const chunkIndexReducer = (
  updateFunction: (
    currentChunkIndex: number,
    newTranscription: string,
    userName: string
  ) => void
) => (state: number, action: ChunkIndexReducerAction): number => {
  updateFunction(
    state,
    action.payload.newTranscription,
    action.payload.userName
  );
  switch (action.type) {
    case ChunkIndexActionType.NextChunk:
      return state + 1;
    case ChunkIndexActionType.PreviousChunk:
      return state - 1;
  }
};

const useTranscribe = (
  chunksState: [Chunk[], StateSetter<Chunk[]>],
  userName: string | null
): {
  toNextChunk: () => void;
  toPrevChunk: () => void;
  disableNextChunk: boolean;
  disablePrevChunk: boolean;
  currentChunk: Chunk;
  progressState: [ProgressState, StateSetter<ProgressState>];
  transcriptionState: [string, StateSetter<string>];
  updateChunk: () => void;
} => {
  const [chunks, setChunks] = chunksState;
  const [progressState, setProgressState] = useState<ProgressState>({
    progress: 0,
    fromPlayer: true,
  });
  // State for what is in the Input field
  const [transcription, setTranscription] = useState<string>("");

  /**
   * This function updates the chunks state, based on the current
   * state of currentChunkIndex and transcription.
   */
  const updateChunk = (
    currentChunkIndex: number,
    newTranscription: string,
    userName: string
  ) => {
    setChunks((chunks) =>
      chunks.map((c) =>
        c.id === chunks[currentChunkIndex].id
          ? {
              ...c,
              /* This call to oneSatisfies checks if the current user has
               * already made a transcription for this chunk (in that case,
               * update that chunk instead of creating a new one)
               */
              transcriptions: oneSatisfies(
                c.transcriptions,
                (t) => t.creatorid === userName
              )
                ? c.transcriptions.map((t) =>
                    t.creatorid === userName
                      ? { ...t, content: newTranscription }
                      : t
                  )
                : c.transcriptions.concat([
                    {
                      creatorid: userName,
                      content: newTranscription,
                      id: uuidv4(),
                      updatedat: new Date(),
                    },
                  ]),
            }
          : c
      )
    );
  };

  const [currentChunkIndex, dispatchChunkIndex] = useReducer(
    chunkIndexReducer(updateChunk),
    0
  );

  const disableNextChunk = currentChunkIndex >= chunks.length - 1;
  const disablePrevChunk = currentChunkIndex <= 0;

  useEffect(() => {
    setProgressState({
      progress: chunks[currentChunkIndex].starttimeseconds,
      fromPlayer: false,
    });
  }, [currentChunkIndex, chunks]);

  const currentChunk = chunks[currentChunkIndex];

  useEffect(() => {
    ((usersTranscription) =>
      usersTranscription.length
        ? setTranscription(usersTranscription[0].content)
        : setTranscription(""))(
      currentChunk.transcriptions.filter((el) => el.creatorid === userName)
    );
  }, [currentChunk, userName]);

  return {
    toNextChunk: () =>
      userName &&
      dispatchChunkIndex({
        type: ChunkIndexActionType.NextChunk,
        payload: { newTranscription: transcription, userName },
      }),
    toPrevChunk: () =>
      userName &&
      dispatchChunkIndex({
        type: ChunkIndexActionType.PreviousChunk,
        payload: { newTranscription: transcription, userName },
      }),
    disableNextChunk,
    disablePrevChunk,
    currentChunk,
    progressState: [progressState, setProgressState],
    transcriptionState: [transcription, setTranscription],
    updateChunk: () =>
      userName && updateChunk(currentChunkIndex, transcription, userName),
  };
};

export default useTranscribe;
