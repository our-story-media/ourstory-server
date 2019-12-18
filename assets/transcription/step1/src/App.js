import React from "react";
import "./App.css";
import VideoPlayer from "./components/videoPlayer";

const sources = {
  bunnyTrailer: "http://media.w3.org/2010/05/bunny/trailer.mp4",
  bunnyMovie: "http://media.w3.org/2010/05/bunny/movie.mp4"
};

//load object from api:


function App() {

  // console.log(window.location.href);
  // console.log(window.location.href.split('/'));



  var id = window.location.href.split('/')[5].split('?')[0];
  var apikey = window.location.href.split('apikey=')[1];


  // var id = 1;

  return (
    <main className="container mt-3">
      <VideoPlayer src={'/api/watch/getvideo/'+id} id={id} apikey={apikey}></VideoPlayer>
    </main>
  );
}

export default App;
