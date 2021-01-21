// External Dependencies
import {
  Container,
  Typography,
  GridList,
  GridListTile,
  List,
  ListItem,
} from "@material-ui/core";
import React, { useMemo } from "react";

// Internal Dependencies
import {
  listContributions,
  getNameOf,
  toShortTimeStamp,
  parseTimeStamp,
  secondsOf,
} from "../../utils/chunkManipulation";
import { Contribution, Chunk } from "../../utils/types";
import CentralModal from "../CentralModal/CentralModal";
import FlatPaper from "../FlatPaper/FlatPaper";
import SimpleCard from "../SimpleCard/SimpleCard";

const ContributerListModal: React.FC<{
  show: boolean;
  exit: () => void;
  chunks: Chunk[];
}> = ({ show, exit, chunks }) => {
  const ContributionDescription: React.FC<{
    chunk: Chunk;
    type: "chunk" | "transcription" | "review";
  }> = ({ type, chunk }) => {
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
        chunk "{getNameOf(chunk)}" (
        {`${toShortTimeStamp(
          secondsOf(parseTimeStamp(chunk.starttimestamp))
        )} - ${toShortTimeStamp(
          secondsOf(parseTimeStamp(chunk.endtimestamp))
        )}`}
        )
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
    <CentralModal
      header={
        <Typography variant="h3" style={{ fontWeight: "lighter" }}>
          Contributers
        </Typography>
      }
      open={show}
      exit={exit}
    >
      <FlatPaper>
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
