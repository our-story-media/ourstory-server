// External Dependencies
import React, { useState } from 'react';
import { PlayArrow, Pause } from '@material-ui/icons';

// Internal Dependencies
import story_id from './getId';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

// Styles
import './App.css';

const App: React.FC<{}> = () => {

  return (
    <main>
      <VideoPlayer url={`/api/watch/getvideo/${story_id}`}/>
    </main>
  );
}

export default App;
