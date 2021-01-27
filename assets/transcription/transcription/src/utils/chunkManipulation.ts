import { Chunk, Contribution } from "./types";

/**
 * Given an integer return a string representation of that integer
 * padded with zeros up until the tens column
 *
 * Examples:
 * zeroPad(8) -> '08'
 * zeroPad(12) -> '12'
 *
 * @param value the value to zero pad
 */
export const zeroPad = (value: number) =>
  ((rounded) => (rounded < 10 ? `0${rounded}` : rounded.toString()))(
    Math.floor(value)
  );

/**
 * Helper function to convert a number of seconds to a string with format
 * HH:MM:SS:mm
 * (Hours, Minutes, Seconds, Milliseconds)
 *
 * @param seconds the number of seconds
 */
export const toTimeStamp = (seconds: number) =>
  `${zeroPad(seconds / (60 * 60))}:${zeroPad(seconds / 60)}:${zeroPad(
    seconds % 60
  )}:${zeroPad(Math.round((seconds - Math.floor(seconds)) * 100))}`;

/**
 * Helper function to convert a number of seconds to a string with format
 * HH:MM:SS:mm
 * (Hours, Minutes, Seconds, Milliseconds)
 * If the the number of seconds is less than an hour, use the format:
 * MM:SS:mm
 *
 * @param seconds
 */
export const toShortTimeStamp = (seconds: number) =>
  seconds > 60 * 60
    ? toTimeStamp(seconds).substring(0, 8)
    : toTimeStamp(seconds).substring(3, 8);

/**
 * Given a list of chunks, get the end of the last time stamp.
 * If the list is empty return the start of the video
 *
 * @param chunks the chunks to extract the last time stamp from
 */
export const getLastEndTimeStamp = (chunks: Chunk[]): string =>
  chunks.length > 0 ? chunks[chunks.length - 1].endtimestamp : "00:00:00:00";

/**
 * Given a list of chunks, get the endtimeseconds of the last chunk.
 * If the list is empty, return the start of the video (zero seconds)
 *
 * @param chunks the chunks to extract the last time from
 */
export const getLastEndTimeSeconds = (chunks: Chunk[]): number =>
  chunks.length > 0 ? chunks[chunks.length - 1].endtimeseconds : 0;

/**
 * Given a list of chunks and a time (as a fraction),
 * if there exists a chunk that that time is within,
 * return the chunk, else, return null
 *
 * For example, if this is called with time = 0.5,
 * and in the list of chunks there exists chunk 'A' that
 * has start and end times 0.3 and 0.51 respectively, then
 * chunk 'A' will be returned
 *
 * @param chunks - the list of chunks to find the enclosing chunk in
 * @param time - the time to find enclosed
 */
export const getEnclosingChunk = (
  chunks: Chunk[],
  time: number
): Chunk | undefined => {
  for (var i = 0; i < chunks.length; i++) {
    if (time > chunks[i].starttimeseconds && time < chunks[i].endtimeseconds)
      return chunks[i];
  }
  return undefined;
};

/**
 * Given a time (as a fraction), and a list of chunks,
 * returns whether that time is valid as a new split
 *
 * A new split is invalid if it is the start/finish time
 * of a chunk in the list, if it's 0, or if it is greater
 * than the duration of the video
 *
 * @param chunks - the chunks that are being added to
 * @param time - the time stamp of the new chunk
 * @param storyDuration - the duration of the video being chunked
 */
export const invalidSplit = (
  chunks: Chunk[],
  time: number,
  storyDuration: number
) => {
  return (
    time === 0 ||
    time > storyDuration ||
    chunks.reduce(
      (onBoundary: boolean, chunk) =>
        onBoundary ||
        chunk.endtimeseconds === time ||
        chunk.starttimeseconds === time,
      false
    )
  );
};

/**
 * Given a chunk, returns whether that chunk has no transcription
 * (All of it's transcription objects have content equal to "")
 *
 * @param chunk the chunk to check
 */
export const hasTranscription = (chunk: Chunk): boolean =>
  chunk.transcriptions.reduce<boolean>(
    (acc, t) => acc || t.content !== "",
    false
  );

/**
 * Given a list of chunks, return the number of chunks that have a
 * transcription.
 *
 * @param chunks the chunks to count
 */
export const countChunksWithTranscription = (chunks: Chunk[]): number =>
  chunks.reduce<number>(
    (acc, chunk) => acc + (hasTranscription(chunk) ? 1 : 0),
    0
  );

/**
 * Given a list of chunks, return the number of chunks that have
 * been reviewed
 *
 * @param chunks the chunks to count
 */
export const countReviewedChunks = (chunks: Chunk[]): number =>
  chunks.reduce((acc, chunk) => acc + (chunk.review ? 1 : 0), 0);

/**
 * Given a list of chunks, fetches the list of all contributions
 *
 * @param chunks the chunks to extract contributers from
 */
export const listContributions = (chunks: Chunk[]): Contribution[] =>
  /**
   * We get the list of all contributers and then create a Set from it
   * to remove duplicates. We then create a array from that set.
   */
  chunks
    .map<Contribution>((chunk) => ({
      name: chunk.creatorid,
      for: "chunk" as const,
      chunk,
    }))
    .concat(
      chunks.reduce(
        (acc, chunk) =>
          acc.concat(
            chunk.transcriptions.map((transcription) => ({
              name: transcription.creatorid,
              for: "transcription" as const,
              chunk,
            }))
          ),
        [] as Contribution[]
      )
    )
    .concat(
      chunks.reduce(
        (acc, chunk) =>
          chunk.review
            ? acc.concat([
                {
                  name: chunk.review.reviewedby,
                  for: "review" as const,
                  chunk,
                },
              ])
            : acc,
        [] as Contribution[]
      )
    );

export const getAdjacentChunks = (
  chunk: Chunk,
  allChunks: Chunk[]
): { prev: Chunk | undefined; next: Chunk | undefined } =>
  allChunks.reduce<{ prev: Chunk | undefined; next: Chunk | undefined }>(
    (acc, el, idx) =>
      el.id === chunk.id
        ? { prev: allChunks[idx - 1], next: allChunks[idx + 1] }
        : acc,
    { prev: undefined, next: undefined }
  );

export type Time = {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

export const parseTimeStamp = (stamp: string) => ({
  hours: Number(stamp.slice(0, 2)),
  minutes: Number(stamp.slice(3, 5)),
  seconds: Number(stamp.slice(6, 8)),
  milliseconds: Number(stamp.slice(9, 11)),
});

/**
 * Given a chunk return a start and end Time object
 *
 * @param chunk the chunk to parse the timestamps of
 */
export const parseChunkTimeStamps = (
  chunk: Chunk
): { start: Time; end: Time } => ({
  start: parseTimeStamp(chunk.starttimestamp),
  end: parseTimeStamp(chunk.endtimestamp),
});

/**
 * Given a time object, return the number of seconds, in that time
 * object, excluding the milliseconds
 *
 * @param time the time to get the seconds for
 */
export const secondsOf = (time: Time) =>
  time.hours * 60 * 60 + time.minutes * 60 + time.seconds;

export const getNameOf = (chunk: Chunk) =>
  chunk.name
    ? chunk.name
    : `${
        secondsOf(parseTimeStamp(chunk.endtimestamp)) -
        secondsOf(parseTimeStamp(chunk.starttimestamp))
      } second chunk`;
