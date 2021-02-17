import * as React from "react";
import { renderHook, act, RenderResult } from "@testing-library/react-hooks";
import {
  useNewChunk,
  useDeleteChunk,
  useUpdateTranscription,
} from "./chunksActions";
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
var updateTranscription: (
  toUpdate: Chunk,
  updatedTranscription: string,
  userName: string
) => void;

// Helper function to get current chunks state
const chunks = () => {
  return chunkState.current[0];
};

beforeEach(() => {
  chunkState = renderHook(() => React.useState<Chunk[]>([])).result;
  setChunks = chunkState.current[1];
  newChunk = renderHook(() => useNewChunk(setChunks)).result.current;
  deleteChunk = renderHook(() => useDeleteChunk(setChunks)).result.current;
  updateTranscription = renderHook(() => useUpdateTranscription(setChunks))
    .result.current;
});

test("test new chunk", () => {
  // Insert First Chunk
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunks().length).toBe(1);
  expect(chunks()[0].creatorid).toBe(testUserName);
  expect(chunks()[0].endtimeseconds).toBe(0.5);
  expect(chunks()[0].starttimeseconds).toBe(0);
  expect(chunks()[0].endtimestamp).toBe(`00:00:06:00`);
  expect(chunks()[0].starttimestamp).toBe(`00:00:00:00`);
  expect(chunks()[0].transcriptions).toStrictEqual([]);
});

test("new chunk with overlapping chunk", () => {
  // Insert overlapping chunk
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunks().length).toBe(1);

  const originalId = chunks()[0].id;

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
  expect(chunks().length).toBe(2);
  expect(chunks()[0].starttimeseconds).toBe(0);
  expect(chunks()[0].endtimeseconds).toBe(0.25);
  expect(chunks()[1].starttimeseconds).toBe(0.25);
  expect(chunks()[1].endtimeseconds).toBe(0.5);
  // Both of the ID's should be new
  expect(chunks()[0].id === originalId).toBe(false);
  expect(chunks()[1].id === originalId).toBe(false);
});

test("delete chunk that doesn't exist", () => {
  // Deleting a chunk that doesn't exist is a no-op
  act(() => {
    deleteChunk(testChunk);
  });

  expect(chunks()).toStrictEqual([]);
});

test("delete chunk", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  // Assert new chunk inserted correctly
  expect(chunks().length).toBe(1);
  expect(chunks()[0].endtimeseconds).toBe(0.5);

  // Delete chunk
  act(() => {
    deleteChunk(chunks()[0]);
  });

  // Chunk should be deleted
  expect(chunks()).toStrictEqual([]);
});

test("add transcription to untranscribed chunk", () => {
  // Insert chunk to update transcription of
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunks().length).toBe(1);

  // Add a transcription
  act(() => {
    updateTranscription(chunks()[0], "test transcription", testUserName);
  });

  // Assert transcription was added correctly
  expect(chunks()[0].transcriptions.length).toBe(1);
  expect(chunks()[0].transcriptions[0].content).toBe("test transcription");
  expect(chunks()[0].transcriptions[0].creatorid).toBe(testUserName);
});

test("update user's transcription", () => {
  // Insert chunk to update transcription of
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunks().length).toBe(1);

  // Add a transcription
  act(() => {
    updateTranscription(chunks()[0], "test transcription", testUserName);
  });

  // Assert transcription was added correctly
  expect(chunks()[0].transcriptions.length).toBe(1);
  expect(chunks()[0].transcriptions[0].content).toBe("test transcription");
  expect(chunks()[0].transcriptions[0].creatorid).toBe(testUserName);

  // Update Transcription
  act(() => {
    updateTranscription(chunks()[0], "updated transcription", testUserName);
  });

  // Assert transcription was added correctly
  expect(chunks()[0].transcriptions.length).toBe(1);
  expect(chunks()[0].transcriptions[0].content).toBe("updated transcription");
  expect(chunks()[0].transcriptions[0].creatorid).toBe(testUserName);
});

test("add second user's transcription", () => {
  // Insert chunk to update transcription of
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunks().length).toBe(1);

  // Add a transcription
  act(() => {
    updateTranscription(chunks()[0], "test transcription", testUserName);
  });

  // Assert transcription was added correctly
  expect(chunks()[0].transcriptions.length).toBe(1);
  expect(chunks()[0].transcriptions[0].content).toBe("test transcription");
  expect(chunks()[0].transcriptions[0].creatorid).toBe(testUserName);

  act(() => {
    updateTranscription(
      chunks()[0],
      "second transcription",
      `${testUserName}2`
    );
  });

  // Assert transcription was added correctly
  expect(chunks()[0].transcriptions.length).toBe(2);
  expect(chunks()[0].transcriptions[1].content).toBe("second transcription");
  expect(chunks()[0].transcriptions[1].creatorid).toBe(`${testUserName}2`);
});

test("add transcription to chunk that doesn't exist", () => {
  // Add a transcription
  act(() => {
    updateTranscription(testChunk, "test transcription", testUserName);
  });

  // Adding a transcription to a chunk that doesn't exist is a no-op
  expect(chunks().length).toBe(0);
});
