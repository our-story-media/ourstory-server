// External Dependencies
import { Container, GridList, GridListTile } from "@material-ui/core";
import React from "react";

// Internal Dependencies
import Header from "../Header/Header";
import StepInfo from "./StepInfo";

const steps = [
  {
    title: "Chunking",
    description:
      "We need to know when people are talking in the story, so that we can transcribe them.",
    progress: 10,
  },
  {
    title: "Transcription",
    description:
      "Writing down exactly what is said in each chunk of the story.",
    progress: 10,
  },
  {
    title: "Review",
    description:
      "Reviewing content is key to making sure we represent participants authentically.",
    progress: 10,
  },
];

const App: React.FC<{}> = () => {
  
  return (
    <main>
      <Header>
        <Container>
          There are 3 stages to transcribing, select which stage you are
          performing
          <GridList cols={3}>
            {steps.map((step) => (
              <GridListTile style={{paddingLeft: '15px', paddingRight: '15px'}}>
                <StepInfo key={step.title} {...step} />
              </GridListTile>
            ))}
          </GridList>
        </Container>
      </Header>
    </main>
  );
};

export default App;
