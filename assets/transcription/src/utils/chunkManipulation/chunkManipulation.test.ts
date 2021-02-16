import { getEnclosingChunk } from "./chunkManipulation";

test("get enclosing chunk", () => {
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
  expect(getEnclosingChunk([testChunk], 0.25)).toBe(testChunk);
});
