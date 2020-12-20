// External Dependencies
import {
  Box,
  ButtonBase,
  Container,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Internal Dependencies
import theme from "../../styles/theme";
import ChunkEditor from "../ChunkEditor/ChunkEditor";
import Dashboard from "../Dashboard/Dashboard";
import Header from "../Header/Header";
import useSteps from "./hooks/useSteps";
import View from "./Views";
import story_id from "../../utils/getId";
import api_key from "../../utils/getApiKey";
import { Chunk } from "../../utils/types";
import Transcriber from "../Transcriber/Transcriber";

const useStyles = makeStyles({
  backButton: {
    background: "transparent",
    color: "black",
    fontSize: "16px",
  },
});

const BackButton: React.FC<{ action: () => void }> = ({ action }) => {
  const classes = useStyles();
  return (
    <Box>
      <ButtonBase className={classes.backButton} onClick={action}>
        <ChevronLeft />
        Back
      </ButtonBase>
    </Box>
  );
};

const App: React.FC<{}> = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const steps = useSteps(setView, {
    step1: true,
    step2: chunks.length > 0,
    step3: chunks.length > 0,
  });

  const [story, setStory] = useState<any>({ loading: true });

  useEffect(() => {
    axios
      .get(`http://localhost:8845/api/watch/edit/${story_id}`)
      .then((r) => {
        r.data.transcription &&
          setChunks(
            r.data.transcription.chunks.map((c: any) => ({
              starttimestamp: c.starttimestamp,
              starttimeseconds: c.starttimeseconds,
              endtimestamp: c.endtimestamp,
              endtimeseconds: c.endtimeseconds,
              creatorid: c.creatorid,
              updatedat: c.updatedat,
              id: c.id,
              transcriptions: c.transcriptions
            }))
          );
        setStory({ ...r.data, loading: false });
      })
      .catch((error) => console.log(error)); // TODO Handle errors more eloquently
  }, []);

  useEffect(() => {
    console.log({ ...story, transcription: { chunks } });
    !story.loading &&
      axios
        .post(
          `http://localhost:8845/api/watch/savedit/${story_id}?apikey=${api_key}`,
          { ...story, transcription: { chunks } }
        )
        .catch((error) => console.log(error));
  }, [chunks, story]);

  return (
    <ThemeProvider theme={theme}>
      <main>
        <Header>
          <Container>
            {view !== View.Dashboard && (
              <BackButton action={() => setView(View.Dashboard)} />
            )}
          </Container>
          {view === View.Dashboard ? (
            <Dashboard steps={steps} storyName={story.title} />
          ) : view === View.Chunking ? (
            <ChunkEditor chunksState={[chunks, setChunks]} />
          ) : view === View.Transcribing ? (
            <Transcriber story_id={story_id} chunksState={[chunks, setChunks]} />
          ) : view === View.Reviewing ? (
            <div>Reviewing</div>
          ) : null}
        </Header>
      </main>
    </ThemeProvider>
  );
};

export default App;
