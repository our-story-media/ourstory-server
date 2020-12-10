// External Dependencies
import React from 'react';

// Internal Dependencies
import story_id from './getId';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

// Styles
import useStyles from './AppStyles';

const App: React.FC<{}> = () => {

  const classes = useStyles();

  return (
    <main>
      {/* The 'http://localhost:8845' part of the url below is temporary, and not needed in production*/}
      <div className={classes.videoPlayerContainer}>
        <VideoPlayer url={`http://localhost:8845/api/watch/getvideo/${story_id}`}/>
      </div>
    </main>
  );
}

export default App;
