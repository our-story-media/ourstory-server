// External Dependencies
import React, { useState } from 'react';

// Internal Dependencies
import story_id from './getId';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

// Styles
import './App.css';

const App: React.FC<{}> = () => {

  return (
    <main>
      {/* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/}
      <VideoPlayer url={`http://localhost:8845/api/watch/getvideo/${story_id}`}/>
    </main>
  );
}

export default App;
