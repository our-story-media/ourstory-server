import { useCallback } from "react";
import oneSatisfies from "../../../utils/oneSatisfies";
import { Chunk, Transcription } from "../../../utils/types";
import { SplitState } from "../../VideoPlayer/Hooks/useVideoPlayerState";

export const getUsersTranscription = (
  chunk: Chunk,
  userName: string
): Transcription | undefined =>
  oneSatisfies(chunk.transcriptions, (t) => t.creatorid === userName)
    ? chunk.transcriptions.filter((t) => t.creatorid === userName)[0]
    : undefined;

export const getMiniChunks = (chunk: Chunk, duration: number) => {
  var miniChunks: number[] = [];

  var currentTime = chunk.starttimeseconds + 4 / duration;

  while (currentTime < chunk.endtimeseconds) {
    miniChunks.push(currentTime);
    currentTime += 5 / duration;
  }

  return miniChunks;
};

type TranscriberAction = {
  actionType:
    | "go to next page"
    | "go to previous page"
    | "transcription changed"
    | "go to first mini chunk"
    | "go to last mini chunk"
    | "refresh mini chunks"
    | "flush transcription changes";
  newTranscription?: string;
};

type TranscriberState = {
  currentChunk: number;
  currentMiniChunk: number;
  miniChunks: number[];
  transcription: string;
};

const getMiniChunkEnd = (miniChunk: number, duration: number) => {
  const value = miniChunk + 1 / duration;
  return value > duration ? duration : value;
};

const getMiniChunkStart = (
  prevMiniChunk: number | undefined,
  currentChunk: Chunk
) => {
  return prevMiniChunk ?? currentChunk.starttimeseconds;
};

// const makeTranscriberPageChange = ;

/**
 * TODO - change this into a hook, so that the caller doesn't have to use 'useCallback',
 * we should do that internall
 */
const useTranscriberReducer = (
  chunks: Chunk[],
  duration: number,
  updateTranscription: (
    toUpdate: Chunk,
    updatedTranscription: string,
    userName: string
  ) => void,
  userName: string | undefined,
  setSplit: React.Dispatch<React.SetStateAction<SplitState>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  onComplete: () => void
) => {
  const pageChange = useCallback(
    (
      newCurrentChunk: number,
      newMiniChunks: number[],
      newCurrentMiniChunk: number,
      newTranscription: string
    ) => {
      const newChunkStart = getMiniChunkStart(
        newMiniChunks[newCurrentMiniChunk - 1],
        chunks[newCurrentChunk]
      );

      setProgress(newChunkStart);
      console.log(
        `Transcriber setting split to: { start: ${newChunkStart}, end: ${getMiniChunkEnd(
          newMiniChunks[newCurrentMiniChunk],
          duration
        )}}`
      );
      setSplit({
        start: newChunkStart,
        end: getMiniChunkEnd(newMiniChunks[newCurrentMiniChunk], duration),
      });
      return {
        miniChunks: newMiniChunks,
        currentChunk: newCurrentChunk,
        currentMiniChunk: newCurrentMiniChunk,
        transcription: newTranscription,
      };
    },
    [setProgress, setSplit, chunks, duration]
  );

  const trancribeReducer = useCallback(
    (state: TranscriberState, action: TranscriberAction): TranscriberState => {
      if (
        userName &&
        [
          "go to next page",
          "go to previous page",
          "flush transcription changes",
        ].includes(action.actionType)
      ) {
        console.log(
          `Updating transcription of ${state.currentChunk} chunk to be ${state.transcription}`
        );
        updateTranscription(
          chunks[state.currentChunk],
          state.transcription,
          userName
        );
      }

      switch (action.actionType) {
        case "go to next page":
          if (
            state.currentMiniChunk === state.miniChunks.length - 1 &&
            state.currentChunk < chunks.length - 1
          ) {
            const newCurrentChunk = state.currentChunk + 1;
            return pageChange(
              newCurrentChunk,
              getMiniChunks(chunks[newCurrentChunk], duration),
              0,
              getUsersTranscription(chunks[newCurrentChunk], userName ?? "")
                ?.content ?? ""
            );
          } else if (state.currentMiniChunk < state.miniChunks.length - 1) {
            return pageChange(
              state.currentChunk,
              state.miniChunks,
              state.currentMiniChunk + 1,
              state.transcription
            );
          } else {
            onComplete();
          }
          break;
        case "go to previous page":
          if (state.currentMiniChunk === 0 && state.currentChunk > 0) {
            const newCurrentChunk = state.currentChunk - 1;
            const newMiniChunks = getMiniChunks(
              chunks[newCurrentChunk],
              duration
            );
            return pageChange(
              newCurrentChunk,
              newMiniChunks,
              newMiniChunks.length - 1,
              getUsersTranscription(chunks[newCurrentChunk], userName ?? "")
                ?.content ?? ""
            );
          } else if (state.currentMiniChunk > 0) {
            return pageChange(
              state.currentChunk,
              state.miniChunks,
              state.currentMiniChunk - 1,
              state.transcription
            );
          }
          break;
        case "transcription changed":
          return action.newTranscription !== undefined
            ? { ...state, transcription: action.newTranscription }
            : { ...state };
        case "go to first mini chunk":
          const firstMiniChunk = 0;
          pageChange(state.currentChunk, state.miniChunks, firstMiniChunk, state.transcription);
          return { ...state, currentMiniChunk: firstMiniChunk };
        case "go to last mini chunk":
          const lastMiniChunk = state.miniChunks.length - 1;
          pageChange(state.currentChunk, state.miniChunks, lastMiniChunk, state.transcription);
          return { ...state, currentMiniChunk: lastMiniChunk };
        case "refresh mini chunks":
          const newMiniChunks = getMiniChunks(
            chunks[state.currentChunk],
            duration
          );
          pageChange(state.currentChunk, newMiniChunks, 0, state.transcription);
          return {
            ...state,
            currentMiniChunk: 0,
            miniChunks: newMiniChunks,
          };
      }
      return state;
    },
    [chunks, duration, updateTranscription, userName, onComplete, pageChange]
  );
  return trancribeReducer;
};

export default useTranscriberReducer;
