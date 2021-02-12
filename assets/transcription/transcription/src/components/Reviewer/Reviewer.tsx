import {
  Box,
  Container,
  Divider,
  makeStyles,
  Radio,
  Typography,
} from "@material-ui/core";
import { AccountCircle, ArrowLeft, ArrowRight, Done, Edit } from "@material-ui/icons";
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
import LoadingModal from "../LoadingModal/LoadingModal";
import OnboardingModal from "../OnboardingModal/OnboardingModal";
import ChunkCard from "../SimpleCard/ChunkCard";
import EditTranscriptionCard from "../SimpleCard/EditTranscriptionCard";
import Slideshow from "../Slideshow/Slideshow";
import { UserContext } from "../UserProvider/UserProvider";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import WarningMessage from "../WarningMessage/WarningMessage";

type ReviewerProps = {
  story_id: string;
  atExit: () => void;
  onboarding: {
    showOnboardingModal: boolean;
    dismissOnboardingModal: () => void;
  };
};

const useStyles = makeStyles({
  doneButton: {
    backgroundColor: "green",
    color: "white",
  },
  cardContainer: {
    marginTop: "8px",
    marginBottom: "8px",
    padding: "0 8px 0 8px",
    width: "100%",
  },
});

export const Reviewer: React.FC<ReviewerProps> = ({
  atExit,
  story_id,
  onboarding,
}) => {
  const { showOnboardingModal, dismissOnboardingModal } = onboarding;

  const {
    progressState,
    splitState: [, setSplit],
    controller: playerController,
    playerRef,
    duration,
  } = useVideoPlayerController();

  const { setProgressWithVideoUpdate } = progressState;

  const [chunks] = chunksContext.useChunksState();

  const classes = useStyles();

  const chunksToReview = chunks.filter(hasTranscription);

  const { page, goTo } = useSlideshow(chunksToReview);

  const currentChunk = useMemo(
    /**
     * Here, if the chunks to review array is empty, we use a dummy chunk,
     * as we are about to exit, and if we set it to undefined we will crash
     */
    () => chunksToReview[page],
    [page, chunksToReview]
  );

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
    setProgressWithVideoUpdate(currentChunk.starttimeseconds);
  }, [page, chunks, currentChunk, setProgressWithVideoUpdate, setSplit]);

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
      <LoadingModal open={duration === 0} />
      <Container style={{ marginTop: "4px" }}>
        <BackButton action={atExit} />
      </Container>
      <OnboardingModal
        show={showOnboardingModal}
        dismiss={dismissOnboardingModal}
        steps={[
          "You are about to review the transcriptions made on the video.",
          "For each chunk, select one of the transcriptions from the list. You can do this by clicking on the text or the check box to the left of the text.",
          "You can also edit the transcriptions by clicking on the pencil button above the text.",
        ]}
        title={<h2 style={{ margin: 0 }}>Transcribing Instructions</h2>}
        startButtonContent={<div>Start Reviewing</div>}
      />
      <CentralModal
        open={editingTranscription !== undefined}
        header={
          <WarningMessage
            message={
              <div style={{whiteSpace: "pre"}}>
                You Are Editing{' '}
                <span
                  style={{ textDecoration: "underline" }}
                >{`${editingTranscription?.creatorid}`}</span>
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
            transcriptionValue={transcriptionEdit}
            onChange={setTranscriptionEdit}
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
              disabled={transcriptionEdit === ""}
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
          playerRef={playerRef}
          progressState={progressState}
          url={`http://${api_base_address}:8845/api/watch/getvideo/${story_id}`}
          controller={playerController}
        />
      </Box>
      <Container>
        <Slideshow
          currentPage={page}
          onNavigate={goTo}
          numberOfPages={chunksToReview.length}
          onComplete={atExit}
          style={{ width: "100%" }}
          contentContainerStyle={{margin: "0 64px 0 64px"}}
          leftColumn={
            <div style={{position: "fixed", bottom: 0, left: 0, margin: "16px", zIndex: 1}}>
              <IndabaButton>
                <ArrowLeft />
              </IndabaButton>
            </div>
          }
          rightColumn={
            <div style={{position: "fixed", bottom: 0, right: 0, margin: "16px", zIndex: 1}}>
              <IndabaButton>
                <ArrowRight />
              </IndabaButton>
            </div>
          }
        >
          <ChunkCard chunk={currentChunk}>
            {currentChunk.transcriptions.map(
              (transcription) =>
                transcription.content && (
                  <Box key={transcription.id} className={classes.cardContainer}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.2rem",
                          display: "flex",
                          justifyContent: "center",
                          paddingLeft: "10px",
                        }}
                      >
                        <AccountCircle />
                        <div style={{ marginLeft: "4px", overflowWrap: "anywhere" }}>
                          {transcription.creatorid}
                        </div>
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
                      <Radio
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
                      <Typography variant="h6" style={{ padding: "8px", overflowWrap: "anywhere" }}>
                        {transcription.content}
                      </Typography>
                    </div>
                    <Divider style={{ margin: "16px 0 16px 0" }} />
                  </Box>
                )
            )}
          </ChunkCard>
        </Slideshow>
      </Container>
    </div>
  );
};
