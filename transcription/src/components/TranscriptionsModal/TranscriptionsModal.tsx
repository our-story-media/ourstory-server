import React from "react";
import { getNameOf } from "../../utils/chunkManipulation/chunkManipulation";
import { Chunk } from "../../utils/types";
import CentralModal from "../CentralModal/CentralModal";
import SimpleCard from "../SimpleCard/SimpleCard";
import { Card, Divider } from "@material-ui/core";

type TranscriptionsModalProps = {
  /* The chunk to show the transcriptions for.
   * When this is undefined, don't show the modal
   */
  chunk: Chunk | undefined;
  exit: () => void;
};

const TranscriptionsModal: React.FC<TranscriptionsModalProps> = ({
  chunk,
  exit,
}) => (
  <CentralModal
    open={chunk !== undefined}
    // TODO- this breaks if the name is too long
    header={
      <h2
        style={{ margin: 0, overflowWrap: "anywhere" }}
      >{`Transcriptions for "${chunk && getNameOf(chunk)}"`}</h2>
    }
    exit={exit}
  >
    <div style={{ overflow: "scroll" }}>
      {chunk?.transcriptions.map((transcription) => (
        <div style={{margin:'8px'}}>
          <SimpleCard
            key={transcription.id}
            title={<b>{transcription.creatorid}</b>}
            contentStyle={{ whiteSpace: "pre", marginBottom:'-10px' }}
          >
            {transcription.content}
          </SimpleCard>
          {/* <Divider /> */}
        </div>
      ))}
    </div>
  </CentralModal>
);

export default TranscriptionsModal;
