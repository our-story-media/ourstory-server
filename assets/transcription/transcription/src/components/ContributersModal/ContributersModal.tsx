// External Dependencies
import {
  Container,
  Typography,
  Divider,
  GridList,
  GridListTile,
  List,
  ListItem,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { useMemo } from "react";

// Internal Dependencies
import {
  Time,
  parseChunkTimeStamps,
  listContributions,
} from "../../utils/chunkManipulation";
import { Contribution, Chunk } from "../../utils/types";
import CentralModal from "../CentralModal/CentralModal";
import FlatPaper from "../FlatPaper/FlatPaper";
import IndabaButton from "../IndabaButton/IndabaButton";
import SimpleCard from "../SimpleCard/SimpleCard";

const ContributerListModal: React.FC<{
  show: boolean;
  exit: () => void;
  chunks: Chunk[];
}> = ({ show, exit, chunks }) => {
  /**
   * Helper function to get a nicely formatted time
   *
   * @param time the time to get a well formatted string for
   * @param format the current formatted string, this is just for passing down
   * recursively
   */
  const formatTime = (time: Time, format: string): string =>
    time.hours
      ? formatTime({ ...time, hours: 0 }, `${time.hours}hrs `)
      : time.minutes
      ? formatTime({ ...time, minutes: 0 }, `${format} ${time.minutes}mins `)
      : time.seconds
      ? formatTime({ ...time, seconds: 0 }, `${format} ${time.seconds}secs`)
      : format === ""
      ? "0secs"
      : format;

  const ContributionDescription: React.FC<{
    chunk: Chunk;
    type: "chunk" | "transcription" | "review";
  }> = ({ type, chunk }) => {
    const startEnd = parseChunkTimeStamps(chunk);
    const chunkDescription = formatTime(startEnd.start, "");
    const typeDescription = (type: "chunk" | "transcription" | "review") => {
      switch (type) {
        case "chunk":
          return "Created ";
        case "transcription":
          return "Transcribed ";
        case "review":
          return "Reviewed ";
      }
    };
    return (
      <span>
        <span style={{ fontWeight: "bold" }}>{typeDescription(type)}</span>the
        chunk that starts at {chunkDescription}
      </span>
    );
  };

  const contributers = useMemo(
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

  return (
    <CentralModal open={show}>
      <FlatPaper>
        <Container>
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
        </Container>
        <Container
          style={{ height: "80vh", width: "90vw", overflow: "scroll" }}
        >
          <GridList cols={1} cellHeight="auto">
            {contributers.map((contributer) => (
              <GridListTile key={contributer[0]}>
                <SimpleCard title={contributer[0]}>
                  <List>
                    {contributer[1].map((contribution) => (
                      <ListItem
                        key={`${contribution.chunk.id}${contribution.for}`}
                      >
                        <ContributionDescription
                          chunk={contribution.chunk}
                          type={contribution.for}
                        />
                      </ListItem>
                    ))}
                  </List>
                </SimpleCard>
              </GridListTile>
            ))}
          </GridList>
        </Container>
      </FlatPaper>
    </CentralModal>
  );
};

export default ContributerListModal;
