import { Chunk } from "./types";

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
export const toShortTimeStamp = (seconds: number) => (seconds > 60 * 60) ? toTimeStamp(seconds).substring(0, 8) : toTimeStamp(seconds).substring(3, 8);

/**
 * Given a list of chunks, get the end of the last time stamp.
 * If the list is empty return the start of the video
 * 
 * @param chunks the chunks to extract the last time stamp from
 */
export const getLastEndTimeStamp = (chunks: Chunk[]): string =>
  chunks.length > 0 ? chunks[chunks.length - 1].endtimestamp : "00:00:00:00";

  /**
   * Given a list of chunks, get the end of the last time seconds.
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
 * @param chunks
 * @param time
 */
export const getEnclosingChunk = (chunks: Chunk[], time: number): Chunk | null => {
  for (var i = 0; i < chunks.length; i++) {
    if (time > chunks[i].starttimeseconds && time < chunks[i].endtimeseconds)
      return chunks[i];
  }
  return null;
};

/**
 * Given a time (as a fraction), and a list of chunks,
 * returns whether that time is valid as a new split
 *
 * A new split is invalid if it is the start/finish time
 * of a chunk in the list, or if it's 0
 *
 * @param chunks
 * @param time
 */
export const invalidSplit = (chunks: Chunk[], time: number) => {
  return (
    time === 0 ||
    chunks.reduce(
      (onBoundary: boolean, chunk) =>
        onBoundary ||
        chunk.endtimeseconds === time ||
        chunk.starttimeseconds === time,
      false
    )
  );
};
