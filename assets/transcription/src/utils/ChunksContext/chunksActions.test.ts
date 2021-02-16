import * as React from "react";
import { renderHook, act, RenderResult } from "@testing-library/react-hooks";
import { useNewChunk, useDeleteChunk } from "./chunksActions";
import { Chunk } from "../types";

// Dumby values
const testUserName = "test";
const testDuration = 12;
const testChunk = {
  starttimeseconds: 0,
  starttimestamp: "",
  endtimeseconds: 0.5,
  endtimestamp: "",
  creatorid: "",
  updatedat: new Date(),
  id: "testId",
  transcriptions: [],
};

// Here we declare variables that will be used in our tests.
// The variables are initialized in beforeEach
var chunkState: RenderResult<
  [Chunk[], React.Dispatch<React.SetStateAction<Chunk[]>>]
>;
var setChunks: React.Dispatch<React.SetStateAction<Chunk[]>>;
var newChunk: (
  splitAt: number,
  storyDuration: number,
  userName: string
) => void;
var deleteChunk: (toDelete: Chunk) => void;

beforeEach(() => {
  chunkState = renderHook(() => React.useState<Chunk[]>([])).result;
  setChunks = chunkState.current[1];
  newChunk = renderHook(() => useNewChunk(setChunks)).result.current;
  deleteChunk = renderHook(() => useDeleteChunk(setChunks)).result.current;
});

test("test new chunk", () => {
  // Dumby state initialized to empty array
  expect(chunkState.current[0]).toStrictEqual([]);

  // Insert First Chunk
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunkState.current[0].length).toBe(1);
  expect(chunkState.current[0][0].creatorid).toBe(testUserName);
  expect(chunkState.current[0][0].endtimeseconds).toBe(0.5);
  expect(chunkState.current[0][0].starttimeseconds).toBe(0);
  expect(chunkState.current[0][0].endtimestamp).toBe(`00:00:06:00`);
  expect(chunkState.current[0][0].starttimestamp).toBe(`00:00:00:00`);
  expect(chunkState.current[0][0].transcriptions).toStrictEqual([]);
});

test("new chunk with overlapping chunk", () => {
  // Dumby state initialized to empty array
  expect(chunkState.current[0]).toStrictEqual([]);

  // Insert overlapping chunk
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  // Dumby state initialized to empty array
  expect(chunkState.current[0].length).toBe(1);

  const originalId = chunkState.current[0][0].id;

  // Insert overlapped chunk
  act(() => {
    newChunk(0.25, testDuration, testUserName);
  });

  /*
   * There should now be 2 chunks, with the first
   * ending where the new chunk was inserted,
   * and the second ending where the original
   * chunk ended
   */
  expect(chunkState.current[0].length).toBe(2);
  expect(chunkState.current[0][0].starttimeseconds).toBe(0);
  expect(chunkState.current[0][0].endtimeseconds).toBe(0.25);
  expect(chunkState.current[0][1].starttimeseconds).toBe(0.25);
  expect(chunkState.current[0][1].endtimeseconds).toBe(0.5);
  // Both of the ID's should be new
  expect(chunkState.current[0][0].id === originalId).toBe(false);
  expect(chunkState.current[0][1].id === originalId).toBe(false);
});

test("delete chunk that doesn't exist", () => {
  // Dumby state initialized to empty array
  expect(chunkState.current[0]).toStrictEqual([]);

  // Deleting a chunk that doesn't exist is a no-op
  act(() => {
    deleteChunk(testChunk);
  });

  expect(chunkState.current[0]).toStrictEqual([]);
});

test("delete chunk", () => {
  // Dumby state initialized to empty array
  expect(chunkState.current[0]).toStrictEqual([]);

  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  // Assert new chunk inserted correctly
  expect(chunkState.current[0].length).toBe(1);
  expect(chunkState.current[0][0].endtimeseconds).toBe(0.5);

  // Delete chunk
  act(() => {
    deleteChunk(chunkState.current[0][0]);
  });

  // Chunk should be deleted
  expect(chunkState.current[0]).toStrictEqual([]);
});
