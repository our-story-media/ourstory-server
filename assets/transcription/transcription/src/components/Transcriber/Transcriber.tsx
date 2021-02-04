// External Dependencies
import { Box, Container, MobileStepper, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

// Internal Dependencies
import oneSatisfies from "../../utils/oneSatisfies";
import { Chunk } from "../../utils/types";
import { UserContext } from "../UserProvider/UserProvider";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useStyles from "./TranscriberStyles";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import useSlideshow from "../../hooks/useSlideshow";
import { useUpdateTranscription } from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import Slideshow from "../Slideshow/Slideshow";
import IndabaButton from "../IndabaButton/IndabaButton";
import { FileCopy } from "@material-ui/icons";
import CentralModal from "../CentralModal/CentralModal";
import WarningMessage from "../WarningMessage/WarningMessage";
import BackButton from "../BackButton/BackButton";
import useConfirmBeforeAction, {
  NotAttemptingAction,
} from "../../hooks/useConfirmBeforeAction";
import useFirstRender from "../../hooks/useFirstRender";
import EditTranscriptionCard from "../SimpleCard/EditTranscriptionCard";
import SkipForwardBackButtons from "../SkipForwardBackButtons/SkipForwardBackButtons";
import { api_base_address } from "../../utils/getApiKey";

const getUsersTranscription = (chunk: Chunk, userName: string): string =>
  oneSatisfies(chunk.transcriptions, (t) => t.creatorid === userName)
    ? chunk.transcriptions.filter((t) => t.creatorid === userName)[0].content
    : "";

type TranscriberProps = {
  story_id: string;
  atExit: () => void;
};

const getMiniChunks = (chunk: Chunk, duration: number) => {
  var miniChunks: number[] = [];

  var currentTime = chunk.starttimeseconds + 4 / duration;

  while (currentTime < chunk.endtimeseconds) {
    miniChunks.push(currentTime);
    currentTime += 5 / duration;
  }

  return miniChunks;
};

const Transcriber: React.FC<TranscriberProps> = ({ story_id, atExit }) => {
  const [chunks] = chunksContext.useChunksState();

  const {
    progressState,
    playerRef,
    splitState: [, setSplit],
    duration,
    controller,
  } = useVideoPlayerController();

  const { setProgressWithVideoUpdate } = progressState;

  const { userName } = useContext(UserContext);

  const [transcription, setTranscription] = useState("");

  const { page, direction, goTo } = useSlideshow(chunks);

  /*
   * firstRender and this effect are used to update
   * the transcription of the page everytime the page changes.
   * (we don't want to do the effect on the first render)
   */
  const firstRender = useFirstRender();
  useEffect(() => {
    !firstRender &&
      userName &&
      updateTranscription(
        chunks[page + (direction === "next" ? -1 : 1)],
        transcription,
        userName
      );
  }, [page, direction]);

  const currentChunk = useMemo(() => chunks[page], [chunks, page]);

  /* Each chunk is presented as a series of smaller, mini, chunks */
  const [miniChunks, setMiniChunks] = useState<{
    chunks: number[];
    currentChunk: number;
  }>({ chunks: [], currentChunk: 0 });

  useEffect(() => {
    setMiniChunks({
      chunks: getMiniChunks(currentChunk, duration),
      currentChunk: 0,
    });
  }, [currentChunk, duration]);

  const currentMiniChunkStart = useMemo(() => {
    return (
      miniChunks.chunks[miniChunks.currentChunk - 1] ??
      currentChunk.starttimeseconds
    );
  }, [miniChunks, duration]);

  const currentMiniChunkEnd = useMemo(() => {
    const value = miniChunks.chunks[miniChunks.currentChunk] + 1 / duration;
    return value > duration ? duration : value;
  }, [miniChunks, duration]);

  useEffect(() => {
    userName && setTranscription(getUsersTranscription(currentChunk, userName));
    setSplit({
      start: /*currentChunk.starttimeseconds*/ currentMiniChunkStart,
      end: /*currentChunk.endtimeseconds*/ currentMiniChunkEnd,
    });
    setProgressWithVideoUpdate(currentMiniChunkStart);
  }, [chunks, page, userName, miniChunks, duration]);

  const updateTranscription = useUpdateTranscription();

  const classes = useStyles();

  const inputRef = useRef(null);

  useEffect(() => {
    (inputRef.current
      ? (inputRef.current as any)
      : { focus: () => null }
    ).focus();
  }, [page]);

  const {
    attemptingActionWith: attemptingTranscriptionChangeWith,
    attemptAction: tryCopyTranscription,
    cancelAction: cancelCopyTranscription,
    confirmAction: confirmCopyTranscription,
  } = useConfirmBeforeAction(
    (oldTranscription: string, newTranscription: string) =>
      setTranscription(newTranscription),
    (oldTranscription) => oldTranscription !== ""
  );

  const exitHandler = () => {
    userName && updateTranscription(currentChunk, transcription, userName);
    atExit();
  };

  return (
    <div>
      <Container style={{ marginTop: "4px" }}>
        <BackButton action={exitHandler} />
      </Container>
      {chunks.length && (
        <>
          <CentralModal
            exit={cancelCopyTranscription}
            header={
              <WarningMessage message={"You Will Lose Your Transcription"} />
            }
            open={
              attemptingTranscriptionChangeWith !== NotAttemptingAction.True
            }
          >
            <div>
              Duplicating this transcription will discard your current
              transcription! Are you sure you want to discard your
              transcription?
              <br />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <IndabaButton
                  style={{ marginTop: "8px" }}
                  onClick={confirmCopyTranscription}
                >
                  <FileCopy fontSize="large" style={{ marginRight: "8px" }} />
                  <Typography variant="subtitle1">Confirm</Typography>
                </IndabaButton>
              </div>
            </div>
          </CentralModal>
          <Box className={classes.videoPlayerContainer}>
            <VideoPlayer
              progressState={progressState}
              playerRef={playerRef}
              url={`http://${api_base_address}:8845/api/watch/getvideo/${story_id}`}
              controller={controller}
              loop
            />
          </Box>
          <Container style={{ height: "50vh", overflow: "scroll" }}>
            <MobileStepper
              variant="dots"
              steps={miniChunks.chunks.length}
              activeStep={miniChunks.currentChunk}
              position="static"
              nextButton={
                <IndabaButton
                  disabled={
                    miniChunks.currentChunk === miniChunks.chunks.length - 1
                  }
                  onClick={() =>
                    setMiniChunks((prev_mini_chunks) => ({
                      ...prev_mini_chunks,
                      currentChunk: prev_mini_chunks.currentChunk + 1,
                    }))
                  }
                >
                  Next
                </IndabaButton>
              }
              backButton={
                <IndabaButton
                  disabled={miniChunks.currentChunk === 0}
                  onClick={() =>
                    setMiniChunks((prev_mini_chunks) => ({
                      ...prev_mini_chunks,
                      currentChunk: prev_mini_chunks.currentChunk - 1,
                    }))
                  }
                >
                  Back
                </IndabaButton>
              }
            />
            <Slideshow
              onNavigate={goTo}
              currentPage={page}
              numberOfPages={chunks.length}
              onComplete={exitHandler}
            >
              <EditTranscriptionCard
                inputRef={inputRef}
                chunk={currentChunk}
                transcriptionState={[transcription, setTranscription]}
              />
            </Slideshow>
          </Container>
        </>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
        }}
      >
        {false && (
          <SkipForwardBackButtons
            style={{
              margin: "8px",
              width: "calc(100% - 16px)",
              display: "flex",
              justifyContent: "space-between",
            }}
            skipForward={() =>
              duration &&
              setProgressWithVideoUpdate((progress) => progress + 5 / duration)
            }
            skipBackward={() =>
              duration &&
              setProgressWithVideoUpdate((progress) => progress - 5 / duration)
            }
          />
        )}
      </div>
    </div>
  );
};

export default Transcriber;
