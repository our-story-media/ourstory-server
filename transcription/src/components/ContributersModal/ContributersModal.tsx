// External Dependencies
import {
  Container,
  Typography,
  GridList,
  GridListTile,
  List,
  Divider,
  ListItem,
} from "@material-ui/core";
import React, { useMemo } from "react";
import LocalizedStrings from "react-localization";

// Internal Dependencies
import {
  listContributions,
  getNameOf,
  toShortTimeStamp,
  parseTimeStamp,
  secondsOf,
} from "../../utils/chunkManipulation/chunkManipulation";
import { Contribution, Chunk } from "../../utils/types";
import CentralModal from "../CentralModal/CentralModal";
import FlatPaper from "../FlatPaper/FlatPaper";
import SimpleCard from "../SimpleCard/SimpleCard";
import { getUsersTranscription } from "../Transcriber/hooks/useTranscriberState";

const strings = new LocalizedStrings({
  en: {
    yr: "year",
    mt: "month",
    dy: "day",
    hr: "hour",
    min: "minute",
    sec: "second",
    yrs: "years",
    mts: "months",
    dys: "days",
    hrs: "hours",
    mins: "minutes",
    secs: "seconds",
    periodAgo: "{0} {1} ago",
    contributions: "Contributions",

    created: "Created",
    transcribed: "Transcribed",
    reviewed: "Reviewed",
    contributionDescription: '{0} the chunk "{1}" ({2}) {3}', // Example: Created the chunk "chunk_name" (00:00:00 - 01:01:01) 4 minutes ago
  },
});

const pluralize = (epoch: string) => {
  return strings.getString(`${epoch}s`);
};

const epochs = [
  ["yr", 31536000],
  ["mt", 2592000],
  ["dy", 86400],
  ["hr", 3600],
  ["min", 60],
  ["sec", 1],
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
  return { interval: 0, epoch: strings.sec };
};

const timeAgo = (date: Date) => {
  const timeAgoInSeconds = Math.floor((+new Date() - +new Date(date)) / 1000);
  const { interval, epoch } = getDuration(timeAgoInSeconds);
  return epoch === strings.sec
    ? strings.formatString(strings.periodAgo, "Less than a", "minute")
    : strings.formatString(
        strings.periodAgo,
        interval.toString(),
        `${interval === 1 ? strings.getString(epoch) : pluralize(epoch)}`
      );
};

const ContributionDescription: React.FC<{
  contribution: Contribution;
}> = ({ contribution }) => {
  const { type, name, chunk } = contribution;
  const typeDescription = (type: "chunk" | "transcription" | "review") => {
    switch (type) {
      case "chunk":
        return strings.created;
      case "transcription":
        return strings.transcribed;
      case "review":
        return strings.reviewed;
    }
  };
  return (
    <span style={{ whiteSpace: "pre", display: "flex", flexWrap: "wrap" }}>
      {strings.formatString(
        strings.contributionDescription,
        <span style={{ fontWeight: "bold" }}>{typeDescription(type)}</span>,
        <div style={{ overflowWrap: "anywhere" }}>{getNameOf(chunk)}</div>,
        <>
          {`${toShortTimeStamp(
            secondsOf(parseTimeStamp(chunk.starttimestamp))
          )} - ${toShortTimeStamp(
            secondsOf(parseTimeStamp(chunk.endtimestamp))
          )}`}
        </>,
        <Typography
          variant="subtitle2"
          style={{ marginLeft: "4px", fontWeight: 600 }}
        >
          {timeAgo(
            type === "chunk"
              ? chunk.updatedat
              : type === "transcription"
              ? getUsersTranscription(chunk, name)?.updatedat ?? new Date()
              : chunk.review?.reviewedat ?? new Date()
          )}
        </Typography>
      )}
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
          {strings.contributions}
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
                <SimpleCard
                  title={
                    <div style={{ overflowWrap: "anywhere" }}>
                      {contributer[0]}
                    </div>
                  }
                >
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
                {/* <Divider /> */}
              </GridListTile>
            ))}
          </GridList>
        </Container>
      </FlatPaper>
    </CentralModal>
  );
};

export default ContributerListModal;
