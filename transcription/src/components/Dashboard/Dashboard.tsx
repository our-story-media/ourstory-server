// External Dependencies
import { Box, Typography, Grid, Chip, Avatar } from "@material-ui/core";
import LocalizedStrings from "react-localization";
// import { ChevronLeft } from "@material-ui/icons";
import React, { useContext } from "react";
// import { useHistory } from "react-router-dom";


// Internal Dependencies
import StepInfo, { StepInfoProps } from "../App/StepInfo";
import useStyles from "./DashboardStyles";
import { UserContext } from "../UserProvider/UserProvider";
import NameModal from "../NameModal/NameModal";
// import IndabaLink from "../IndabaLink/IndabaLink";

const strings = new LocalizedStrings({
  en: {
    back: "Back",
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

// const Greeting: React.FC<{ name: string | undefined }> = ({ name }) => (
//   <Chip
//     avatar={<Avatar>M</Avatar>}
//     variant="outlined"
//     label={name}
//     style={{
      
//     }}
//     />
// );

const Title: React.FC<{ storyName: string }> = ({ storyName }) => (
  <Typography variant="h4" style={{ color: "gray", fontWeight: "lighter", marginTop:'0.4em' }}>
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

  // const history = useHistory();

  const { userName, setName, clearName } = useContext(UserContext);

  const classes = useStyles();

  return (
    <Grid item xs={9} md={11}>
      <NameModal setName={setName} show={!userName} />
      <Grid item xs={12} className={classes.introContainer}>
      {/* <Button component="a" href="/">
        <ChevronLeft fontSize="large" />
        {strings.back}
        </Button> */}
        <Title storyName={storyName} />
        {/* <Greeting name={userName} /> */}
        {/* {userName && (
          <IndabaLink
            onClick={() => {
              clearName();
              logOutAction();
            }}
          >
            {strings.notMe}
          </IndabaLink>
        )} */}
        {userName && (
        <Chip
        onDelete={() => {
          clearName();
          logOutAction();
        }}
    avatar={<Avatar>{userName.substring(0,1)}</Avatar>}
    variant="outlined"
    label={userName}
    style={{
      marginTop:'10px'
    }}
    />)}
      </Grid>
      <div
        style={{ marginBottom: "16px", marginTop: "16px", textAlign: "center",color:"#333" }}
      >
        {strings.steps}
      </div>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignContent="flex-start"
        alignItems="stretch"
      >
        {steps.map((step) => (
          <Grid
            item
            key={step.title}
            xs={12}
            md={4}
            lg={3}
            style={{ display: "flex" }}
          >
            <StepInfo {...step} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
