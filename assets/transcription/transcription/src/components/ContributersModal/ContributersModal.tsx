// External Dependencies
import {
  Container,
  Box,
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
  parseTimeStamps,
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

  const contributionDescription = (
    type: "chunk" | "transcription" | "review",
    chunk: Chunk
  ) => {
    const startEnd = parseTimeStamps(chunk);
    const chunkDescription = formatTime(startEnd.start, "");
    switch (type) {
      case "chunk":
        return `Created the chunk that starts at ${chunkDescription}`;
      case "transcription":
        return `Transcribed the chunk that starts at ${chunkDescription}`;
      case "review":
        return `Reviewed the chunk that starts at ${chunkDescription}`;
    }
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
      <Container  style={{ height: "80vh", width: "90vw" }}>
        <FlatPaper>
          <Box>
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
                    <List>
                      {contributer[1].map((contribution) => (
                        <ListItem key={`${contribution.chunk.id}${contribution.for}`}>
                          {contributionDescription(
                            contribution.for,
                            contribution.chunk
                          )}
                        </ListItem>
                      ))}
                    </List>
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

export default ContributerListModal;
