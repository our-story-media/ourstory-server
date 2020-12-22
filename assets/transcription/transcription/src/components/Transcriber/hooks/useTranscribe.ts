// External Dependencies
import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import oneSatisfies from "../../../utils/oneSatisfies";

// Internal Dependencies
import { Chunk, StateSetter } from "../../../utils/types";
import { UserContext } from "../../UserProvider/UserProvider";
import { ProgressState } from "../../VideoPlayer/Hooks/useVideoPlayerProgress";

enum ChunkIndexAction {
  NextChunk,
  PreviousChunk,
}

const chunkIndexReducer = (
  updateFunction: (currentChunkIndex: number) => void
) => (state: number, action: ChunkIndexAction): number => {
  updateFunction(state);
  switch (action) {
    case ChunkIndexAction.NextChunk:
      return state + 1;
    case ChunkIndexAction.PreviousChunk:
      return state - 1;
  }
};

const useTranscribe = (
  chunksState: [Chunk[], StateSetter<Chunk[]>]
): [
  // toNextChunk Function
  () => void,
  // toPrevChunk Function
  () => void,
  // Disable next chunk button
  boolean,
  // Disable prev chunk button
  boolean,
  // Current Chunk
  Chunk,
  // Progress of the video
  [ProgressState, StateSetter<ProgressState>],
  // Transcription text
  [string, StateSetter<string>],
  // Update the current chunks transcription
  () => void
] => {
  const [chunks, setChunks] = chunksState;
  const [progressState, setProgressState] = useState<ProgressState>({
    progress: 0,
    fromPlayer: true,
  });
  const { userName } = useContext(UserContext);
  // State for what is in the Input field
  const [transcription, setTranscription] = useState<string>("");

  const updateChunk = useCallback(
    (currentChunkIndex: number) => {
      userName &&
        setChunks((chunks) =>
          chunks.map((c) =>
            c.id === chunks[currentChunkIndex].id
              ? {
                  ...c,
                  transcriptions: oneSatisfies(
                    c.transcriptions,
                    (t) => t.creatorid === userName
                  )
                    ? c.transcriptions.map((t) =>
                        t.creatorid === userName
                          ? { ...t, content: transcription }
                          : t
                      )
                    : c.transcriptions.concat([
                        {
                          creatorid: userName,
                          content: transcription,
                          id: uuidv4(),
                          updatedat: new Date(),
                        },
                      ]),
                }
              : c
          )
        );
    },
    [transcription, setChunks, userName]
  );

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
  }, [currentChunk]);

  return [
    () => dispatchChunkIndex(ChunkIndexAction.NextChunk),
    () => dispatchChunkIndex(ChunkIndexAction.PreviousChunk),
    disableNextChunk,
    disablePrevChunk,
    currentChunk,
    [progressState, setProgressState],
    [transcription, setTranscription],
    () => updateChunk(currentChunkIndex),
  ];
};

export default useTranscribe;
