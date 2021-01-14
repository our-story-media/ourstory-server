import {
  Box,
  Typography,
  Container,
  GridList,
  GridListTile,
} from "@material-ui/core";
import React, { useContext } from "react";
import StepInfo, { StepInfoProps } from "../App/StepInfo";

import useStyles from "./DashboardStyles";
import { UserContext } from "../UserProvider/UserProvider";
import NameModal from "../NameModal/NameModal";
import IndabaLink from "../../IndabaLink/IndabaLink";

type DashboardProps = {
  /** The name of the story being transcribed */
  storyName: string;
  /** The transcription steps and their progress */
  steps: StepInfoProps[];
};

const Greeting: React.FC<{ name: string | null }> = ({ name }) => (
  <Typography style={{ fontWeight: "lighter" }} variant="h5">
    {name && `Hello ${name}`}
  </Typography>
);

const Title: React.FC<{ storyName: string }> = ({ storyName }) => (
  <Typography variant="h3" style={{ color: "gray", fontWeight: "lighter" }}>
    Field Transcription for{" "}
    <Box component="span" style={{ color: "black" }}>
      {storyName}
    </Box>
  </Typography>
);

const Dashboard: React.FC<DashboardProps> = ({ storyName, steps }) => {
  const { userName, setName, clearName } = useContext(UserContext);

  const classes = useStyles();

  return (
    <Box>
      <NameModal setName={setName} show={!userName} />
      <Container>
        <Container className={classes.introContainer}>
          <Title storyName={storyName} />
          <Greeting name={userName} />
          <IndabaLink onClick={clearName}>
            <div>{userName && "This is not me!"}</div>
          </IndabaLink>
        </Container>
        <div style={{ marginBottom: "16px" }}>
          There are 3 stages to transcribing, select which stage you are
          performing
        </div>
        <Box>
          <GridList cols={3} cellHeight="auto" spacing={20}>
            {steps.map((step) => (
              <GridListTile key={step.title}>
                <StepInfo {...step} />
              </GridListTile>
            ))}
          </GridList>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
