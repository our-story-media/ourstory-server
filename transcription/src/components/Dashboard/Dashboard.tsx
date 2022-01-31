// External Dependencies
import {
  Box,
  Typography,
  Container,
  GridList,
  GridListTile,
  Grid,
} from "@material-ui/core";
import LocalizedStrings from "react-localization";
import React, { useContext } from "react";

// Internal Dependencies
import StepInfo, { StepInfoProps } from "../App/StepInfo";
import useStyles from "./DashboardStyles";
import { UserContext } from "../UserProvider/UserProvider";
import NameModal from "../NameModal/NameModal";
import IndabaLink from "../IndabaLink/IndabaLink";

const strings = new LocalizedStrings({
  en: {
    greeting: "Hello {0}",
    transcriptionFor: "Field Transcription for {0}",
    notMe: "This is not me!",
    steps:
      "There are 3 stages to transcribing, select which stage you are performing",
  },
});

type DashboardProps = {
  /** The name of the story being transcribed */
  storyName: string;
  /** The transcription steps and their progress */
  steps: StepInfoProps[];
  /** Action for logging out */
  logOutAction: () => void;
};

const Greeting: React.FC<{ name: string | undefined }> = ({ name }) => (
  <Typography
    style={{ fontWeight: "lighter", overflowWrap: "anywhere", marginTop: "10px", }}
    variant="h5"
  >
    {name && strings.formatString(strings.greeting, name)}
  </Typography>
);

const Title: React.FC<{ storyName: string }> = ({ storyName }) => (
  <Typography variant="h4" style={{ color: "gray", fontWeight: "lighter" }}>
    {strings.formatString(
      strings.transcriptionFor,
      <Box component="span" style={{ color: "black" }}>
        {storyName}
      </Box>
    )}
  </Typography>
);

const Dashboard: React.FC<DashboardProps> = ({
  storyName,
  steps,
  logOutAction,
}) => {
  const { userName, setName, clearName } = useContext(UserContext);

  const classes = useStyles();

  return (
    <Container>
      <NameModal setName={setName} show={!userName} />
      <Container className={classes.introContainer}>
        <Title storyName={storyName} />
        <Greeting name={userName} />
        {userName && (
          <IndabaLink
            onClick={() => {
              clearName();
              logOutAction();
            }}
          >
            {strings.notMe}
          </IndabaLink>
        )}
      </Container>
      <div style={{ marginBottom: "16px", marginTop: "16px", textAlign: "center" }}>{strings.steps}</div>
        <Grid container direction="row" justify="space-between" alignContent="flex-start" alignItems="stretch">
          {steps.map((step) => (
            <Grid item key={step.title} style={{display: 'flex', width: "33%"}}>
              <StepInfo {...step}/>
            </Grid>
          ))}
        </Grid>
    </Container>
  );
};

export default Dashboard;
