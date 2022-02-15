// External Dependencies
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  makeStyles,
  Radio,
  Typography,
} from "@material-ui/core";
import LocalizedStrings from "react-localization";
import {
  AccountCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Done,
  Edit,
} from "@material-ui/icons";
import React, { useMemo, useContext, useEffect, useState } from "react";

// Internal Dependencies
import useSlideshow from "../../hooks/useSlideshow";
import { hasTranscription } from "../../utils/chunkManipulation/chunkManipulation";
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

const strings = new LocalizedStrings({
  en: {
    instructionsOne:
      "You are about to review the transcriptions made on the video.",
    instructionOneStepLabel: "Why?",
    instructionsTwo:
      "For each chunk, select one of the transcriptions from the list. You can do this by clicking on the text or the check box to the left of the text.",
    instructionTwoStepLabel: "What?",
    instructionsThree:
      "You can also edit the transcriptions by clicking on the pencil button above the text.",
    instructionThreeStepLabel: "How",
    editingTranscriptionWarningHeading: "You are editing {0}'s transcription",
    nameTranscription: "{0}: {1}",
    instructionsTitle: "Reviewing Instructions",
  },
});

type ReviewerProps = {
  story_id: string;
  atExit: () => void;
  onboarding: {
    showOnboardingModal: boolean;
    dismissOnboardingModal: () => void;
  };
};

const useStyles = makeStyles((theme) => ({
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
  backButtonContainer: {
    marginTop: "4px",
    padding: "0px",
  },
  videoContainer: {
    height: "40%",
    minHeight: "350px",
    maxWidth: "80%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "50%",
    },
  },
  textReview: {
    padding: "8px",
    overflowWrap: "anywhere",
    whiteSpace: "pre-line",
    maxHeight: "500px",
    overflowY: "scroll",
    border: "2px solid rgba(0, 0, 0, 0.12)",
    borderRadius: "6px",
    marginRight: "12px",
    flexGrow: 1,
    [theme.breakpoints.up("md")]: {
      maxHeight: "250px",
    },
  },
}));

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

  const [chunks, setChunks] = chunksContext.useChunksState();

  const classes = useStyles();

  const chunksToReview = chunks.filter(hasTranscription);

  const { page, goTo, lastPage } = useSlideshow(chunksToReview);

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

  const updateReview = useUpdateReview(setChunks);
  const deleteReview = useDeleteReview(setChunks);

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

  const updateTranscription = useUpdateTranscription(setChunks);

  return (
    <Grid
      container
      alignContent="center"
      alignItems="center"
      spacing={1}
      direction="column"
    >
      <LoadingModal open={duration === 0} />
      <Grid
        item
        container
        className={classes.backButtonContainer}
        xs={12}
        style={{ height: "10%", minHeight: "40px" }}
      >
        <BackButton action={atExit} />
      </Grid>
      <Grid
        item
        container
        alignContent="center"
        alignItems="center"
        className={classes.videoContainer}
      >
        <VideoPlayer
          playerRef={playerRef}
          progressState={progressState}
          url={`${api_base_address}/api/watch/getvideo/${story_id}`}
          controller={playerController}
        />
      </Grid>
      <Grid
        item
        container
        xs={12}
        style={{ height: "40%", marginBottom: "16px" }}
        justify="center"
        alignItems="center"
      >
        <Slideshow
          currentPage={page}
          onNavigate={goTo}
          numberOfPages={chunksToReview.length}
          onComplete={atExit}
          style={{ width: "100%" }}
          contentContainerStyle={{ margin: "0px 5px" }}
          leftColumn={
            <div
              style={{
                height: "300px",
                margin: "0px 6px 0px 6px",
                width: "70px",
                zIndex: 1,
              }}
            >
              <IndabaButton
                onClick={() => goTo("prev")}
                style={{ height: "300px" }}
              >
                <ArrowLeft />
              </IndabaButton>
            </div>
          }
          rightColumn={
            <div
              style={{
                margin: "0px 6px 0px 6px",
                width: "70px",
                zIndex: 1,
              }}
            >
              <IndabaButton
                onClick={() => (lastPage ? atExit() : goTo("next"))}
                style={{
                  backgroundColor: lastPage ? "green" : "#d9534f",
                  height: "300px",
                }}
              >
                {lastPage ? <Check /> : <ArrowRight />}
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
                        marginBottom: "12px",
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
                        <div
                          style={{
                            marginLeft: "4px",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {transcription.creatorid}
                        </div>
                      </div>
                      <IndabaButton
                        onClick={() => setEditingTranscription(transcription)}
                        style={{
                          padding: "0px",
                          height: "32px",
                          width: "32px",
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
                      <Typography variant="h6" className={classes.textReview}>
                        {transcription.content}
                      </Typography>
                    </div>
                  </Box>
                )
            )}
          </ChunkCard>
        </Slideshow>
      </Grid>
      <OnboardingModal
        show={showOnboardingModal}
        dismiss={dismissOnboardingModal}
        steps={[
          strings.instructionsOne,
          strings.instructionsTwo,
          strings.instructionsThree,
        ]}
        stepsLabels={[
          strings.instructionOneStepLabel,
          strings.instructionTwoStepLabel,
          strings.instructionThreeStepLabel,
        ]}
        title={<h2 style={{ margin: 0 }}>{strings.instructionsTitle}</h2>}
        startButtonContent={<div>Start Reviewing</div>}
      />
      <CentralModal
        open={editingTranscription !== undefined}
        header={
          <WarningMessage
            message={
              <div style={{ whiteSpace: "pre" }}>
                {strings.formatString(
                  strings.editingTranscriptionWarningHeading,
                  <span
                    style={{ textDecoration: "underline" }}
                  >{`${editingTranscription?.creatorid}`}</span>
                )}
              </div>
            }
          />
        }
        exit={() => {
          setEditingTranscription(undefined);
        }}
      >
        <div style={{ position: "relative" }}>
          <List style={{ maxHeight: "300px", overflow: "scroll" }}>
            {currentChunk.transcriptions
              .filter((t) => t.id !== editingTranscription?.id)
              .map((t) => (
                <ListItem style={{ display: "flex", whiteSpace: "pre" }}>
                  {strings.formatString(
                    strings.nameTranscription,
                    <span
                      style={{
                        alignSelf: "flex-start",
                        fontWeight: 600,
                      }}
                    >
                      {t.creatorid}
                    </span>,
                    <div
                      style={{ whiteSpace: "pre", overflowWrap: "anywhere" }}
                    >
                      {t.content}
                    </div>
                  )}
                </ListItem>
              ))}
          </List>
          <EditTranscriptionCard
            transcriptionValue={transcriptionEdit}
            onChange={setTranscriptionEdit}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                backgroundColor: "green",
                position: "relative",
                bottom: 0,
                right: 0,
              }}
              disabled={transcriptionEdit === ""}
            >
              <Done />
            </IndabaButton>
          </div>
        </div>
      </CentralModal>
    </Grid>
  );
};
