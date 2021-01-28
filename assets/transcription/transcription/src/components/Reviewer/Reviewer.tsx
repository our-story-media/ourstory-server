import { Box, Checkbox, makeStyles, Typography } from "@material-ui/core";
import { Done, Edit } from "@material-ui/icons";
import React, { useMemo, useContext, useEffect, useState } from "react";
import useSlideshow from "../../hooks/useSlideshow";
import { hasTranscription } from "../../utils/chunkManipulation";
import {
  useDeleteReview,
  useUpdateReview,
  useUpdateTranscription,
} from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import { api_base_address } from "../../utils/getApiKey";
import { Transcription } from "../../utils/types";
import BackButton from "../BackButton/BackButton";
import CentralModal from "../CentralModal/CentralModal";
import IndabaButton from "../IndabaButton/IndabaButton";
import ChunkCard from "../SimpleCard/ChunkCard";
import EditTranscriptionCard from "../SimpleCard/EditTranscriptionCard";
import SimpleCard from "../SimpleCard/SimpleCard";
import Slideshow from "../Slideshow/Slideshow";
import { UserContext } from "../UserProvider/UserProvider";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import WarningMessage from "../WarningMessage/WarningMessage";

interface ReviewerProps {
  story_id: string;
  atExit: () => void;
}

const useStyles = makeStyles({
  doneButton: {
    backgroundColor: "green",
    color: "white",
  },
  cardContainer: {
    marginTop: "8px",
    marginBottom: "8px",
  },
});

export const Reviewer: React.FC<ReviewerProps> = ({ atExit, story_id }) => {
  const {
    progressState: [, setProgress],
    splitState: [, setSplit],
    controller: playerController,
  } = useVideoPlayerController();

  const [chunks] = chunksContext.useChunksState();

  const classes = useStyles();

  const chunksToReview = chunks.filter(hasTranscription);

  const { page, goTo } = useSlideshow(chunksToReview);

  const currentChunk = useMemo(
    /**
     * Here, if the chunks to review array is empty, we use a dummy chunk,
     * as we are about to exit, and if we set it to undefined we will crash
     */
    () => (chunksToReview.length === 0 ? chunks[0] : chunksToReview[page]),
    [page, chunksToReview, chunks]
  );

  /** If the chunks to review array is empty, exit */
  useEffect(() => {
    if (chunksToReview.length === 0) {
      atExit();
    }
  }, [chunksToReview, atExit]);

  /*
   * When the user navigates between chunks,
   * this effect keeps the split and progress of
   * the video player up to date
   */
  useEffect(() => {
    setSplit({
      start: currentChunk.starttimeseconds,
      end: currentChunk.endtimeseconds,
    });
    setProgress(currentChunk.starttimeseconds);
  }, [page, chunks, currentChunk]);

  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const { userName } = useContext(UserContext);

  /*
   * This is the state for the new transcription being edited
   * when the user decides to edit a transcription.
   */
  const [transcriptionEdit, setTranscriptionEdit] = useState("");

  /*
   * State to keep track of which transcription is currently
   * being edited
   */
  const [editingTranscription, setEditingTranscription] = useState<
    undefined | Transcription
  >(undefined);

  useEffect(() => {
    setTranscriptionEdit(
      editingTranscription ? editingTranscription.content : ""
    );
  }, [editingTranscription]);

  const updateTranscription = useUpdateTranscription();

  return (
    <div>
      <div style={{ marginTop: "4px" }}>
        <BackButton action={atExit} />
      </div>
      <CentralModal
        open={editingTranscription !== undefined}
        header={
          <WarningMessage
            message={
              <div>
                You Are Editing{" "}
                <span
                  style={{ textDecoration: "underline" }}
                >{` ${editingTranscription?.creatorid}`}</span>
                's Transcription
              </div>
            }
          />
        }
        exit={() => {
          setEditingTranscription(undefined);
        }}
      >
        <div style={{ position: "relative" }}>
          <EditTranscriptionCard
            chunk={currentChunk}
            transcriptionState={[transcriptionEdit, setTranscriptionEdit]}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IndabaButton
              onClick={() => {
                editingTranscription &&
                  updateTranscription(
                    currentChunk,
                    transcriptionEdit,
                    editingTranscription.creatorid
                  );
                setEditingTranscription(undefined);
              }}
              style={{
                margin: "8px",
                backgroundColor: "#40bf11",
                position: "relative",
                bottom: 0,
                right: 0,
              }}
            >
              <Done />
              <span style={{ marginLeft: "4px", fontSize: "1.05rem" }}>
                Complete
              </span>
            </IndabaButton>
          </div>
        </div>
      </CentralModal>
      <Box>
        <VideoPlayer
          url={`http://${api_base_address}:8845/api/watch/getvideo/${story_id}`}
          controller={playerController}
        />
      </Box>
      <Slideshow
        currentPage={page}
        onNavigate={goTo}
        numberOfPages={chunksToReview.length}
        onComplete={atExit}
      >
        <ChunkCard chunk={currentChunk}>
          {currentChunk.transcriptions.map(
            (transcription) =>
              transcription.content && (
                <Box key={transcription.id} className={classes.cardContainer}>
                  <SimpleCard
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ fontSize: "1.2rem" }}>
                          <span style={{ fontWeight: "bold" }}>Author:</span>
                          {` ${transcription.creatorid}`}
                        </div>
                        <IndabaButton
                          onClick={() => setEditingTranscription(transcription)}
                          style={{
                            padding: "0px",
                            height: "32px",
                            width: "32px",
                            minWidth: "32px",
                          }}
                        >
                          <Edit fontSize="small" />
                        </IndabaButton>
                      </div>
                    }
                  >
                    <div
                      onClick={() =>
                        userName &&
                        (currentChunk.review?.selectedtranscription !==
                        transcription.id
                          ? updateReview(currentChunk, transcription, userName)
                          : deleteReview(currentChunk))
                      }
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <Checkbox
                        checked={
                          currentChunk.review?.selectedtranscription ===
                          transcription.id
                        }
                        onChange={(_, checked) =>
                          userName &&
                          (checked
                            ? updateReview(
                                currentChunk,
                                transcription,
                                userName
                              )
                            : deleteReview(currentChunk))
                        }
                        style={{ backgroundColor: "initial" }}
                      />
                      <Typography style={{ whiteSpace: "pre", padding: "8px" }}>
                        {transcription.content}
                      </Typography>
                    </div>
                  </SimpleCard>
                </Box>
              )
          )}
        </ChunkCard>
      </Slideshow>
    </div>
  );
};
