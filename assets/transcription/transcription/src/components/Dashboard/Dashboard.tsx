import {
  Box,
  Typography,
  Container,
  GridList,
  GridListTile,
  Divider,
} from "@material-ui/core";
import React, { useContext, useMemo } from "react";
import StepInfo, { StepInfoProps } from "../App/StepInfo";

import useStyles from "./DashboardStyles";
import { UserContext } from "../UserProvider/UserProvider";
import NameModal from "../NameModal/NameModal";
import IndabaButton from "../IndabaButton/IndabaButton";
import useToggle from "../../hooks/useToggle";
import FlatPaper from "../FlatPaper/FlatPaper";
import { Close } from "@material-ui/icons";
import IndabaLink from "../../IndabaLink/IndabaLink";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import {
  listContributions,
  parseTimeStamps,
  Time,
} from "../../utils/chunkManipulation";
import CentralModal from "../CentralModal/CentralModal";
import SimpleCard from "../SimpleCard/SimpleCard";
import { Chunk, Contribution } from "../../utils/types";

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

const ContributerListModal: React.FC<{
  show: boolean;
  exit: () => void;
  contributers: [string, Contribution[]][];
}> = ({ show, exit, contributers }) => {
  const prettyTime = (time: Time, pretty: string): string =>
    time.hours
      ? prettyTime({ ...time, hours: 0 }, `${time.hours}hrs `)
      : time.minutes
      ? prettyTime({ ...time, minutes: 0 }, `${pretty} ${time.minutes}mins `)
      : time.seconds
      ? prettyTime({ ...time, seconds: 0 }, `${pretty} ${time.seconds}secs`)
      : pretty === ""
      ? "0secs"
      : pretty;

  const contributionDescription = (
    type: "chunk" | "transcription" | "review",
    chunk: Chunk
  ) => {
    const startEnd = parseTimeStamps(chunk);
    const chunkDescription = prettyTime(startEnd.start, "");
    switch (type) {
      case "chunk":
        return `Created the chunk that starts at ${chunkDescription}`;
      case "transcription":
        return `Transcribed the chunk that starts at ${chunkDescription}`;
      case "review":
        return `Reviewed the chunk that starts at ${chunkDescription}`;
    }
  };

  return (
    <CentralModal open={show}>
      <Container>
        <FlatPaper>
          <Box style={{ height: "80vw" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Typography variant="h3" style={{ fontWeight: "lighter" }}>
                  Contributers
                </Typography>
              </div>
              <IndabaButton onClick={exit}>
                <Close />
              </IndabaButton>
            </div>
            <Divider style={{ margin: "12px 0px 12px 0px" }} />
            <GridList cols={1} cellHeight="auto">
              {contributers.map((contributer) => (
                <GridListTile key={contributer[0]}>
                  <SimpleCard title={contributer[0]}>
                    {contributer[1].map((contribution) => (
                      <div key={`${contribution.chunk.id}${contribution.for}`}>
                        {contributionDescription(
                          contribution.for,
                          contribution.chunk
                        )}
                      </div>
                    ))}
                  </SimpleCard>
                </GridListTile>
              ))}
            </GridList>
          </Box>
        </FlatPaper>
      </Container>
    </CentralModal>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ storyName, steps }) => {
  const { userName, setName, clearName } = useContext(UserContext);

  const [chunks] = chunksContext.useChunksState();

  const contributions = useMemo(
    () =>
      Array.from(
        listContributions(chunks).reduce(
          (acc, contribution) =>
            acc.get(contribution.name)
              ? acc.set(
                  contribution.name,
                  acc.get(contribution.name)!.concat([contribution])
                )
              : acc.set(contribution.name, [contribution]),
          new Map<string, Contribution[]>()
        )
      ),
    [chunks]
  );
  const classes = useStyles();

  const [showContributers, toggleShowContributers] = useToggle(false);

  return (
    <Box>
      <NameModal setName={setName} show={!userName} />
      <ContributerListModal
        contributers={contributions}
        show={showContributers}
        exit={toggleShowContributers}
      />
      <Container>
        <Container className={classes.introContainer}>
          <Title storyName={storyName} />
          <Greeting name={userName} />
          <IndabaLink onClick={clearName}>
            <Typography variant="subtitle1">
              {userName && "This is not me!"}
            </Typography>
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
        <IndabaButton
          style={{
            marginBottom: "20px",
            position: "absolute",
            bottom: 0,
            fontSize: "1.1rem",
          }}
          onClick={toggleShowContributers}
        >
          View transcribers
        </IndabaButton>
      </Container>
    </Box>
  );
};

export default Dashboard;
