import React from "react";
import "./App.css";
import VideoPlayer from "./components/videoPlayer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import queryString from "query-string";

function App() {

  
  const parsed = queryString.parse(window.location.search);

  var id = window.location.href.split("/")[5].split("?")[0];
  var apikey = parsed.apikey;
  var name = parsed.name;
  console.log(parsed);
  console.log("Name: ", name)
  

  // var id = 1;
  // var apikey = "";

  return (
    <main>
      <Container maxWidth="lg">
        <CssBaseline />
        <VideoPlayer
          src={"/api/watch/getvideo/" + id}
          id={id}
          name={name}
          apikey={apikey}
        ></VideoPlayer>
        {/* <VideoPlayer
          src={"http://media.w3.org/2010/05/bunny/movie.mp4"}
          id={id}
          apikey={apikey}
        ></VideoPlayer> */}
      </Container>
    </main>
  );
}

export default App;
