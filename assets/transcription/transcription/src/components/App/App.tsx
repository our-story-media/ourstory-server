// External Dependencies
import React from 'react';

// Internal Dependencies
import ChunkEditor from '../ChunkEditor/ChunkEditor';
import Header from '../Header/Header';

const App: React.FC<{}> = () => {
  // TODO: Use reducer to handle actions here


  return (
    <main>
      <Header>
        <ChunkEditor />
      </Header>
    </main>
  );
};

export default App;
