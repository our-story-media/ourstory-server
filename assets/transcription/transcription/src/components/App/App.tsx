// External Dependencies
import React, { MutableRefObject, useRef, useState } from 'react';

// Internal Dependencies
import story_id from './getId';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

// Styles
import useStyles from './AppStyles';
import { Button } from '@material-ui/core';

const App: React.FC<{}> = () => {

  const testProgress = useRef<number>(0) as MutableRefObject<number>;

  const [lastChunkEnd, setLastChunkEnd] = useState(0);

  const classes = useStyles();

  return (
    <main>
      {/* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/}
      <div className={classes.videoPlayerContainer}>
        <VideoPlayer progress={testProgress} url={`http://localhost:8845/api/watch/getvideo/${story_id}`}/>
        <Button variant='contained' color='primary' onClick={() => setLastChunkEnd(testProgress.current)}>Make Split</Button>
        <br/>
        End of last chunk: {lastChunkEnd}
      </div>
    </main>
  );
}

export default App;
