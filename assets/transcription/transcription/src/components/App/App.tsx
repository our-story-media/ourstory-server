// External Dependencies
import React, { useState } from 'react';

// Internal Dependencies
import story_id from './getId';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import ChunkCard from '../ChunkCard/ChunkCard';
import { Chunk } from '../../types';
import { ProgressState } from '../VideoPlayer/Hooks/useVideoPlayerProgress';

// Styles
import useStyles from './AppStyles';
import { Button } from '@material-ui/core';
import { Add, History } from '@material-ui/icons';

const zeroPad = (value: number) =>
  ((rounded) => (rounded < 10 ? `0${rounded}` : rounded.toString()))(
    Math.floor(value)
  );

const toTimeStamp = (seconds: number) =>
  `${zeroPad(seconds / (60 * 60))}:${zeroPad(seconds / 60)}:${zeroPad(
    seconds % 60
  )}:${zeroPad(Math.round((seconds - Math.floor(seconds)) * 100))}`;

const getLastEndTimeStamp = (chunks: Chunk[]): string =>
  chunks.length > 0 ? chunks[chunks.length - 1].endtimestamp : '00:00:00:00';

const getLastEndTimeSeconds = (chunks: Chunk[]): number =>
  chunks.length > 0 ? chunks[chunks.length - 1].endtimeseconds : 0;

/**
 * Given a list of chunks and a time (as a fraction),
 * if there exists a chunk that that time is within,
 * return the chunk, else, return null
 *
 * @param chunks
 * @param time
 */
const getEnclosingChunk = (chunks: Chunk[], time: number): Chunk | null => {
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
const invalidSplit = (chunks: Chunk[], time: number) => {
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

const App: React.FC<{}> = () => {
  // TODO: Use reducer to handle actions here

  const handleNewChunk = () => {
    const enclosingChunk = getEnclosingChunk(chunks, progressState.progress);
    if (invalidSplit(chunks, progressState.progress)) {
      return;
    } else if (enclosingChunk != null) {
      setChunks(
        chunks
          .filter((c) => c.id !== enclosingChunk.id)
          .concat([
            {
              starttimestamp: enclosingChunk.starttimestamp,
              starttimeseconds: enclosingChunk.starttimeseconds,
              endtimestamp: toTimeStamp(progressState.progress * duration),
              endtimeseconds: progressState.progress,
              creatorid: 'test',
              updatedat: new Date(),
              id: (Date.now() + 10).toString(),
            },
            {
              starttimestamp: toTimeStamp(progressState.progress * duration),
              starttimeseconds: progressState.progress,
              endtimestamp: enclosingChunk.endtimestamp,
              endtimeseconds: enclosingChunk.endtimeseconds,
              creatorid: 'test',
              updatedat: new Date(),
              id: Date.now().toString(),
            },
          ]).sort((a, b) => a.endtimeseconds - b.endtimeseconds)
      );
    } else {
      setChunks(
        chunks.concat([
          {
            starttimestamp: getLastEndTimeStamp(chunks),
            endtimestamp: toTimeStamp(progressState.progress * duration),
            starttimeseconds: getLastEndTimeSeconds(chunks),
            endtimeseconds: progressState.progress,
            creatorid: 'Test',
            updatedat: new Date(),
            id: Date.now().toString(),
          },
        ])
      );
    }
  };

  const [progressState, setProgressState] = useState<ProgressState>({progress: 0, fromPlayer: true});

  const [play, setPlay] = useState(false);

  const [duration, setDuration] = useState(0);

  const [chunks, setChunks] = useState<Chunk[]>([]);

  const classes = useStyles();

  return (
    <main>
      {/* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/}
      <div className={classes.videoPlayerContainer}>
        <VideoPlayer
          setDuration={setDuration}
          progressState={[progressState, setProgressState]}
          playState={[play, setPlay]}
          url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
        />
      </div>
      <Button variant='contained' color='primary' onClick={() => setProgressState({progress: progressState.progress - (5 / duration), fromPlayer: false})}>
        <History />
      </Button>
      <Button variant='contained' color='primary' onClick={handleNewChunk}>
        <Add />
      </Button>

      <div className={classes.chunksContainer}>
        {chunks.map((c) => (
          <ChunkCard key={c.id} onPlay={() => {setPlay(true); setProgressState({progress: c.starttimeseconds, fromPlayer: false});}} chunk={c} />
        ))}
      </div>
    </main>
  );
};

export default App;