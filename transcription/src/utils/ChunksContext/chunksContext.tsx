import { createContext, useContext } from "react";
import { Chunk } from "../types";

type StateType = [Chunk[], (setter: (newState: Chunk[]) => Chunk[]) => void]

const ChunksContext = createContext<
  StateType
>([[], () => null]);

type ChunksContextType = React.FC<{
  state: StateType;
}>;

const makeChunksContext = (): {
  ChunksProvider: ChunksContextType;
  useChunksState: () => [
    Chunk[],
    (setter: (newState: Chunk[]) => Chunk[]) => void
  ];
} => {
  const ChunksProvider: React.FC<{ state: StateType }> = ({
    state,
    children,
  }) => {
    return (
      <ChunksContext.Provider value={state}>{children}</ChunksContext.Provider>
    );
  };
  const useChunksState = () => useContext(ChunksContext);
  return { ChunksProvider, useChunksState };
};

const chunksContext = makeChunksContext();

export default chunksContext;
