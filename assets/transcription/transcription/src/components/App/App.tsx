// External Dependencies
import { ThemeProvider } from "@material-ui/core";
import React, { useState } from "react";
import useConditionalRender from "../../hooks/useConditionalRender";

// Internal Dependencies
import theme from "../../styles/theme";
import ChunkEditor from "../ChunkEditor/ChunkEditor";
import Dashboard from "../Dashboard/Dashboard";
import Header from "../Header/Header";
import useSteps from "./useSteps";
import View from "./Views";

const App: React.FC<{}> = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const steps = useSteps(setView);

  return (
    <ThemeProvider theme={theme}>
      <main>
        <Header>
          {useConditionalRender(view, [
            [View.Dashboard, <Dashboard steps={steps} storyName={"Test"} />],
            [View.Chunking, <ChunkEditor />],
            [View.Transcribing, <div>Transcribing</div>],
            [View.Reviewing, <div>Reviewing</div>],
          ])}
        </Header>
      </main>
    </ThemeProvider>
  );
};

export default App;
