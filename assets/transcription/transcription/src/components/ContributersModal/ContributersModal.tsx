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
import { getUsersTranscription } from "../Transcriber/hooks/useTranscriberState";

const epochs = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
] as [string, number][];

const getDuration = (
  timeAgoInSeconds: number
): { interval: number; epoch: string } => {
  for (let [name, seconds] of epochs) {
    const interval = Math.floor(timeAgoInSeconds / +seconds);
    if (interval >= 1) {
      return {
        interval: interval,
        epoch: name,
      };
    }
  }
  return { interval: 0, epoch: "second" };
};

const timeAgo = (date: Date) => {
  const timeAgoInSeconds = Math.floor((+new Date() - +new Date(date)) / 1000);
  const { interval, epoch } = getDuration(timeAgoInSeconds);
  const suffix = interval === 1 ? "" : "s";
  return epoch === "second"
    ? "Less than a minute ago"
    : `${interval} ${epoch}${suffix} ago`;
};

const ContributionDescription: React.FC<{
  contribution: Contribution;
}> = ({ contribution }) => {
  const { type, name, chunk } = contribution;
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
    <span style={{ display: "flex", flexWrap: "wrap" }}>
      <div style={{whiteSpace: "pre"}}><span style={{ fontWeight: "bold" }}>{typeDescription(type)}</span>the
      chunk </div><div style={{ overflowWrap: "anywhere" }}>"{getNameOf(chunk)}"</div> (
      {`${toShortTimeStamp(
        secondsOf(parseTimeStamp(chunk.starttimestamp))
      )} - ${toShortTimeStamp(secondsOf(parseTimeStamp(chunk.endtimestamp)))}`}
      )
      <Typography variant="subtitle2" style={{ marginLeft: "4px", fontWeight: 600 }}>
        {timeAgo(
          type === "chunk"
            ? chunk.updatedat
            : type === "transcription"
            ? getUsersTranscription(chunk, name)?.updatedat ?? new Date()
            : chunk.review?.reviewedat ?? new Date()
        )}
      </Typography>
    </span>
  );
};

const ContributerListModal: React.FC<{
  show: boolean;
  exit: () => void;
  chunks: Chunk[];
}> = ({ show, exit, chunks }) => {
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
          Contributions
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
                <SimpleCard title={<div style={{overflowWrap: "anywhere"}}>{contributer[0]}</div>}>
                  <List>
                    {contributer[1].map((contribution) => (
                      <ListItem
                        key={`${contribution.chunk.id}${contribution.type}`}
                      >
                        <ContributionDescription contribution={contribution} />
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
