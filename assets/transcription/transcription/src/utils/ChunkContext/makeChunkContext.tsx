import { createContext, useContext } from "react";
import { Chunk, State } from "../types";

const ChunkContext = createContext<State<Chunk[]>>([[], () => null]);

const makeChunkContext = () => {
  const ChunkProvider: React.FC<{ state: State<Chunk[]> }> = ({ state, children }) => {
    return <ChunkContext.Provider value={state}>{children}</ChunkContext.Provider>;
  };
  const useStore = () => useContext(ChunkContext);
  return { ChunkProvider, useStore };
};

export default makeChunkContext;