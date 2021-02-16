import * as React from "react";
import { render } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useNewChunk } from "./chunksActions";
import chunksContext from "./chunksContext";
import { Chunk } from "../types";

// Dumby values
const testUserName = "test";
const testDuration = 12;

test("test new chunk", () => {
  // Chunks State
  const { result: stateResult } = renderHook(() => React.useState<Chunk[]>([]));

  // Chunks State Setter
  const setChunks = stateResult.current[1];

  // New chunk function
  const { result: newChunksResult } = renderHook(() => useNewChunk(setChunks));

  // Dumby state initialized to empty array
  expect(stateResult.current[0]).toStrictEqual([]);

  // Insert First Chunk
  act(() => {
    newChunksResult.current(0.5, testDuration, testUserName);
  });

  expect(stateResult.current[0].length).toBe(1);
  expect(stateResult.current[0][0].creatorid).toBe(testUserName);
  expect(stateResult.current[0][0].endtimeseconds).toBe(0.5);
  expect(stateResult.current[0][0].starttimeseconds).toBe(0);
  expect(stateResult.current[0][0].endtimestamp).toBe(`00:00:06:00`);
  expect(stateResult.current[0][0].starttimestamp).toBe(`00:00:00:00`);
  expect(stateResult.current[0][0].transcriptions).toStrictEqual([]);
});

test("new chunk with overlapping chunk", () => {
  const { result: stateResult } = renderHook(() => React.useState<Chunk[]>([]));

  const setChunks = stateResult.current[1];

  const { result: newChunksResult } = renderHook(() => useNewChunk(setChunks));

  // Dumby state initialized to empty array
  expect(stateResult.current[0]).toStrictEqual([]);

  // Insert overlapping chunk
  act(() => {
    newChunksResult.current(0.5, testDuration, testUserName);
  });

  // Dumby state initialized to empty array
  expect(stateResult.current[0].length).toBe(1);

  // Insert overlapped chunk
  act(() => {
    newChunksResult.current(0.25, testDuration, testUserName);
  });

  expect(stateResult.current[0].length).toBe(2);
  expect(stateResult.current[0][0].starttimeseconds).toBe(0);
  expect(stateResult.current[0][0].endtimeseconds).toBe(0.25);
  expect(stateResult.current[0][1].starttimeseconds).toBe(0.25);
  expect(stateResult.current[0][1].endtimeseconds).toBe(0.5);
});
