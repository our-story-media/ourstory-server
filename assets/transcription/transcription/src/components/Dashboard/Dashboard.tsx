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
import FlatPaper from "../FlatPaper/FlatPaper";
import SimpleInputForm from "../SimpleInputForm/SimpleInputForm";

import useLocalStorage from "../../hooks/useLocalStorage";

import useStyles from "./DashboardStyles";
import { name_key } from "../../utils/localStorageKeys";
import { UserContext } from "../UserProvider/UserProvider";

type DashboardProps = {
  /** The name of the story being transcribed */
  storyName: string;
  /** The transcription steps and their progress */
  steps: StepInfoProps[];
};

// Presentation logic for the modal that prompts the user for their name
const useModal = (
  name: string | null,
  setName: (state: string) => void,
  classes: Record<"input" | "button" | "modalContentBox" | "modal", string>
) =>
  useMemo(
    () => (
      <Modal
        disableEnforceFocus
        disableAutoFocus
        className={classes.modal}
        open={!name}
      >
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
      </Modal>
    ),
    [classes, setName, name]
  );

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

  // TODO: Consider breaking down this component into smaller ones,
  // the JSX is quite bloated

  const classes = useStyles();

  return (
    <Box>
      {useModal(userName, setName, classes)}
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
