import { createContext, useContext } from "react";
import { Chunk, State } from "../types";

const ChunksContext = createContext<State<Chunk[]>>([[], () => null]);

const makeChunksContext = () => {
  const ChunksProvider: React.FC<{ state: State<Chunk[]> }> = ({
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
