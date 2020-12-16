import { Box, Modal, Typography, Container, Link, GridList, GridListTile } from "@material-ui/core";
import React from "react";
import StepInfo from "../App/StepInfo";
import FlatPaper from "../FlatPaper/FlatPaper";
import Header from "../Header/Header";
import SimpleInputForm from "../SimpleInputForm/SimpleInputForm";

import useLocalStorage from '../../hooks/useLocalStorage';

import useStyles from './DashboardStyles';
import { name_key } from "../../utils/localStorageKeys";

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

const Dashboard: React.FC<{}> = () => {
  const [name, setName, clearName] = useLocalStorage(name_key);
  
  const classes = useStyles();

  return (
    <Box>
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
              <Typography variant="subtitle1">
                {name && "This is not me!"}
              </Typography>
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
    </Box>
  );
};

export default Dashboard;