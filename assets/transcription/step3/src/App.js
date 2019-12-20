import React from "react";
import "./App.css";
import TranscriptionScroll from "./components/transcriptionScroll";

const sources = {
  bunnyTrailer: "http://media.w3.org/2010/05/bunny/trailer.mp4",
  bunnyMovie: "http://media.w3.org/2010/05/bunny/movie.mp4"
};

const id = window.location.href.split("/")[5].split("?")[0];
const apikey = window.location.href.split("apikey=")[1];
const reviewer = "PeterChen";

function App() {
  return (
    <main className="container mt-3">
      <TranscriptionScroll
        // src={sources.bunnyMovie}
        reviewer={reviewer}
        src={"/api/watch/getvideo/" + id}
        id={id}
        apikey={apikey}
      ></TranscriptionScroll>
    </main>
  );
}

export default App;
