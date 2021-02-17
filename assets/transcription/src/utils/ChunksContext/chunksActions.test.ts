import * as React from "react";
import { renderHook, act, RenderResult } from "@testing-library/react-hooks";
import {
  useNewChunk,
  useDeleteChunk,
  useUpdateTranscription,
  useUpdateReview,
  useDeleteReview,
  useCropChunk,
  useDoWithChunks,
} from "./chunksActions";
import { Chunk, Transcription } from "../types";

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
const testTranscription = {
  creatorid: "no one",
  content: "nothing",
  id: "noID",
  updatedat: new Date(),
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
var updateReview: (
  toUpdate: Chunk,
  selectedTranscription: Transcription,
  userName: string
) => void;
var deleteReview: (toDelete: Chunk) => void;
var cropChunk: (
  toUpdate: Chunk,
  storyDuration: number,
  newSplit: [number, number],
  userName: string,
  newName?: string | undefined
) => void;
var doWithChunks: (doWith: (chunks: Chunk[]) => void) => void;

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
  updateReview = renderHook(() => useUpdateReview(setChunks)).result.current;
  deleteReview = renderHook(() => useDeleteReview(setChunks)).result.current;
  cropChunk = renderHook(() => useCropChunk(setChunks)).result.current;
  doWithChunks = renderHook(() => useDoWithChunks(setChunks)).result.current;
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

test("delete a transcription", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  act(() => {
    updateTranscription(chunks()[0], "some transcription", testUserName);
  });

  expect(chunks()[0].transcriptions.length).toBe(1);

  act(() => {
    updateTranscription(chunks()[0], "", testUserName);
  });

  // Passing an empty string deletes that transcription
  expect(chunks()[0].transcriptions.length).toBe(0);
});

test("review a transcription", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  act(() => {
    updateTranscription(chunks()[0], "transcription", testUserName);
  });

  act(() => {
    updateTranscription(chunks()[0], "transcription2", `${testUserName}2`);
  });

  // Review should be undefined until updateReview is called on that chunk
  expect(chunks()[0].review).toBeUndefined();

  act(() => {
    updateReview(chunks()[0], chunks()[0].transcriptions[0], testUserName);
  });

  expect(chunks()[0].review).toBeDefined();
  expect(chunks()[0].review?.reviewedby).toBe(testUserName);
  expect(chunks()[0].review?.selectedtranscription).toBe(
    chunks()[0].transcriptions[0].id
  );
});

test("review a transcription that doesn't exist", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  act(() => {
    updateReview(chunks()[0], testTranscription, testUserName);
  });

  // Reviewing a transcripion that doesn't exist is a no-op
  expect(chunks()[0].review).toBeUndefined();
});

test("adding review to chunk that doesn't exist", () => {
  act(() => {
    updateReview(testChunk, testTranscription, testUserName);
  });

  // Adding a review to a transcription that doesn't exist is a no-op
  expect(chunks().length).toBe(0);
});

test("delete review", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  act(() => {
    updateTranscription(chunks()[0], "transcription", testUserName);
  });

  act(() => {
    updateReview(chunks()[0], chunks()[0].transcriptions[0], testUserName);
  });

  expect(chunks()[0].review).toBeDefined();

  act(() => {
    deleteReview(chunks()[0]);
  });

  expect(chunks()[0].review).toBeUndefined();
});

test("delete review that doesn't exist", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunks()[0].review).toBeUndefined();

  act(() => {
    deleteReview(chunks()[0]);
  });

  expect(chunks()[0].review).toBeUndefined();
});

test("delete reviewed transcription", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  act(() => {
    updateTranscription(chunks()[0], "Hello", testUserName);
  });

  act(() => {
    updateReview(chunks()[0], chunks()[0].transcriptions[0], testUserName);
  });

  expect(chunks()[0].review).toBeDefined();
  expect(chunks()[0].transcriptions.length).toBe(1);

  act(() => {
    updateTranscription(chunks()[0], "", testUserName);
  });

  // Deleting the selected transcription should make the review undefined
  expect(chunks()[0].review).toBeUndefined();
  expect(chunks()[0].transcriptions.length).toBe(0);
});

test("crop chunk", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunks()[0].endtimeseconds).toBe(0.5);
  expect(chunks()[0].name).toBeUndefined();

  act(() => {
    cropChunk(chunks()[0], testDuration, [0, 0.25], testUserName);
  });

  expect(chunks()[0].endtimeseconds).toBe(0.25);

  // If no newName is passed, name shouldn't change
  expect(chunks()[0].name).toBeUndefined();
});

test("rename chunk", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunks()[0].name).toBeUndefined();

  act(() => {
    cropChunk(chunks()[0], testDuration, [0, 0.5], testUserName, "Hello!");
  });

  expect(chunks()[0].name).toBe("Hello!");
});

test("leave gap at start", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  expect(chunks().length).toBe(1);

  act(() => {
    cropChunk(chunks()[0], testDuration, [0.25, 0.5], "Second Person");
  });

  // Leaving a gap at the start of the chunks shouuld create a new chunk to fill the gap
  expect(chunks().length).toBe(2);

  expect(chunks()[1].creatorid).toBe(testUserName);
  expect(chunks()[0].creatorid).toBe("Second Person");

  expect(chunks()[0].starttimeseconds).toBe(0);
  expect(chunks()[0].endtimeseconds).toBe(0.25);
  expect(chunks()[1].starttimeseconds).toBe(0.25);
  expect(chunks()[1].endtimeseconds).toBe(0.5);
});

test("crop chunk with neighbours", () => {
  act(() => {
    newChunk(0.25, testDuration, testUserName);
  });

  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  act(() => {
    newChunk(0.75, testDuration, testUserName);
  });

  expect(chunks()[0].starttimeseconds).toBe(0);
  expect(chunks()[0].endtimeseconds).toBe(0.25);
  expect(chunks()[1].starttimeseconds).toBe(0.25);
  expect(chunks()[1].endtimeseconds).toBe(0.5);
  expect(chunks()[2].starttimeseconds).toBe(0.5);
  expect(chunks()[2].endtimeseconds).toBe(0.75);

  act(() => {
    cropChunk(chunks()[1], testDuration, [0.2, 0.55], testUserName);
  });

  // Neighbouring chunks should be adjusted accordingly
  expect(chunks()[0].starttimeseconds).toBe(0);
  expect(chunks()[0].endtimeseconds).toBe(0.2);
  expect(chunks()[1].starttimeseconds).toBe(0.2);
  expect(chunks()[1].endtimeseconds).toBe(0.55);
  expect(chunks()[2].starttimeseconds).toBe(0.55);
  expect(chunks()[2].endtimeseconds).toBe(0.75);
 
});

test("crop over a chunk", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  act(() => {
    newChunk(0.6, testDuration, testUserName);
  });

  expect(chunks().length).toBe(2);

  act(() => {
    cropChunk(chunks()[0], testDuration, [0, 0.65], testUserName);
  });

  /*
   * Because the newly cropped chunk ends after the chunk after it ends,
   * the chunk after it is deleted
   */
  expect(chunks().length).toBe(1);
  expect(chunks()[0].starttimeseconds).toBe(0);
  expect(chunks()[0].endtimeseconds).toBe(0.65);
});

test("do with chunks", () => {
  act(() => {
    newChunk(0.5, testDuration, testUserName);
  });

  act(() => {
    newChunk(0.6, testDuration, testUserName)
  });

  var testOutput = [] as number[];

  const testFn = (chunks: Chunk[]) => testOutput = chunks.map((c) => c.endtimeseconds);

  act(() => {
    doWithChunks(testFn);
  });

  expect(testOutput).toStrictEqual([0.5, 0.6]);
});