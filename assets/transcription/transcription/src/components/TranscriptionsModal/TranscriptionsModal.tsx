import React from "react";
import { getNameOf } from "../../utils/chunkManipulation";
import { Chunk } from "../../utils/types";
import CentralModal from "../CentralModal/CentralModal";
import SimpleCard from "../SimpleCard/SimpleCard";

type TranscriptionsModalProps = {
  /* The chunk to show the transcriptions for.
   * When this is undefined, don't show the modal
   */
  chunk: Chunk | undefined;
  exit: () => void
};

const TranscriptionsModal: React.FC<TranscriptionsModalProps> = ({ chunk, exit }) => {
  return (
    <CentralModal
      open={chunk !== undefined}
      header={
        <h2 style={{ margin: 0 }}>{`Transcriptions for "${
          chunk && getNameOf(chunk)
        }"`}</h2>
      }
      exit={exit}
    >
      <div>
        {chunk &&
          chunk.transcriptions.map((transcription) => (
            <SimpleCard key={transcription.id} title={<b>{transcription.creatorid}</b>}>
              {transcription.content}
            </SimpleCard>
          ))}
      </div>
    </CentralModal>
  );
};

export default TranscriptionsModal;
