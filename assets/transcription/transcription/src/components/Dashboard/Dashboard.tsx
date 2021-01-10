import {
  Box,
  Modal,
  Typography,
  Container,
  Link,
  GridList,
  GridListTile,
} from "@material-ui/core";
import React, { useContext, useMemo } from "react";
import StepInfo, { StepInfoProps } from "../App/StepInfo";

import useStyles from "./DashboardStyles";
import { UserContext } from "../UserProvider/UserProvider";
import NameModal from '../NameModal/NameModal';

type DashboardProps = {
  /** The name of the story being transcribed */
  storyName: string;
  /** The transcription steps and their progress */
  steps: StepInfoProps[];
};

const hello = (name: string | null) =>
  <Typography style={{ fontWeight: "lighter" }} variant="h5">
    {name && `Hello ${name}`}
  </Typography>;

const title = (storyName: string) => 
  <Typography variant="h3" style={{ color: "gray", fontWeight: "lighter" }}>
    Field Transcription for{" "}
    <Box component="span" style={{ color: "black" }}>
      {storyName}
    </Box>
  </Typography>;

const Dashboard: React.FC<DashboardProps> = ({ storyName, steps }) => {
  const { userName, setName, clearName}  = useContext(UserContext);

  const classes = useStyles();

  return (
    <Box>
      <NameModal setName={setName} show={!userName} />
      <Container>
        <Container className={classes.introContainer}>
          {title(storyName)}
          {hello(userName)}
          <Link className={classes.notMeLink} onClick={clearName}>
            <Typography variant="subtitle1">
              {userName && "This is not me!"}
            </Typography>
          </Link>
        </Container>
        There are 3 stages to transcribing, select which stage you are
        performing
        <GridList style={{ marginTop: "24px" }} cols={3}>
          {steps.map((step) => (
            <GridListTile key={step.title} style={{ padding: "0px 15px 0px 15px" }}>
              <StepInfo {...step} />
            </GridListTile>
          ))}
        </GridList>
      </Container>
    </Box>
  );
};

export default Dashboard;
