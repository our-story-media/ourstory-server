// External Dependencies
import {
  Box,
  Container,
  GridList,
  GridListTile,
  Modal,
  Link,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import React from "react";
import theme from "../../styles/theme";
import FlatPaper from "../FlatPaper/FlatPaper";

// Internal Dependencies
import Header from "../Header/Header";
import useStyles from "./AppStyles";
import StepInfo from "./StepInfo";
import useLocalStorage from "../../hooks/useLocalStorage";
import SimpleInputForm from "../SimpleInputForm/SimpleInputForm";

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
  const [name, setName, clearName] = useLocalStorage("name");

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <main>
        <Modal
          disableEnforceFocus
          disableAutoFocus
          className={classes.modal}
          open={!name}
        >
          <Box>
            <FlatPaper className={classes.modalContentBox}>
              <Typography variant="subtitle1">
                Please enter your name before performing transcription.
              </Typography>
              <SimpleInputForm
                placeholder="my name"
                buttonText="Perform Transcription"
                classes={classes}
                onSubmit={setName}
              />
            </FlatPaper>
          </Box>
        </Modal>
        <Header>
          <Container>
            <Container className={classes.introContainer}>
              <Typography style={{ fontWeight: "lighter" }} variant="h5">
                {name && `Hello ${name}`}
              </Typography>
              <Link className={classes.notMeLink} onClick={clearName}>
                <Typography variant="subtitle1">{name && 'This is not me!'}</Typography>
              </Link>
            </Container>
            There are 3 stages to transcribing, select which stage you are
            performing
            <GridList style={{ marginTop: "24px" }} cols={3}>
              {steps.map((step) => (
                <GridListTile style={{ padding: "0px 15px 0px 15px" }}>
                  <StepInfo key={step.title} {...step} />
                </GridListTile>
              ))}
            </GridList>
          </Container>
        </Header>
      </main>
    </ThemeProvider>
  );
};

export default App;
