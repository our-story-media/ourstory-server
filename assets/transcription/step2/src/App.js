import React from 'react';
import get from 'lodash/get';
import TranscribeEditor from 'pages/edit';
import CssBaseline from '@material-ui/core/CssBaseline';


function App() {
  // const id = "123";
  // const apiKey = "23123";
  const user = "dave";


  const id = window.location.href.split('/')[5].split('?')[0];
  const apiKey = window.location.href.split('apikey=')[1];

  // const src = "http://media.w3.org/2010/05/bunny/movie.mp4";
  const src = `/api/watch/getvideo/${id}`;

  // const transcriptionUri = '/example.json';

  

  const transcriptionUri = `/api/watch/edit/${id}`;
  const updateRequestUri = `/api/watch/savedit/${id}?apiKey=${apiKey}`;

  const [ data, setData ] = React.useState({});

  // load data
  React.useEffect(()=>{
    fetch(transcriptionUri)
    .then((response)=>{
      return response.json();
    })
    .then((result)=>{
      console.log(result.transcription);
      setData(result.transcription);
    })
    .catch((err)=>{
      console.error(err);
    })
  },[]);

  // update data
  const handleUpdate = (chunks)=>{
    const nextData = {...data, chunks}
    setData(nextData);

    const body = JSON.stringify({data: nextData});
    console.log(body)
    fetch(updateRequestUri, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body,
    })
    .then((response)=>{
      return response;
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  const chunks = get(data, ['chunks'], []);
  return (
    <React.Fragment>
      <CssBaseline/>
      <TranscribeEditor
        chunks={chunks}
        onUpdate={handleUpdate}
        src={src}
        user={user}/>
    </React.Fragment>
  );
}

export default App;
