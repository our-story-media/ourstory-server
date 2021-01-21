// External Dependencies
import { Box, TextField, Typography } from "@material-ui/core";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Internal Dependencies
import oneSatisfies from "../../utils/oneSatisfies";
import { Chunk } from "../../utils/types";
import ChunkCard from "../SimpleCard/ChunkCard";
import { UserContext } from "../UserProvider/UserProvider";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useStyles from "./TranscriberStyles";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import useSlideshow from "../../hooks/useSlideshow";
import { useUpdateTranscription } from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import Slideshow from "../Slideshow/Slideshow";
import SimpleCard from "../SimpleCard/SimpleCard";
import IndabaButton from "../IndabaButton/IndabaButton";
import { FileCopy } from "@material-ui/icons";
import CentralModal from "../CentralModal/CentralModal";
import WarningMessage from "../WarningMessage/WarningMessage";
import BackButton from "../BackButton/BackButton";
import useConfirmBeforeAction from "../../hooks/useConfirmBeforeAction";

const getUsersTranscription = (chunk: Chunk, userName: string): string =>
  oneSatisfies(chunk.transcriptions, (t) => t.creatorid === userName)
    ? chunk.transcriptions.filter((t) => t.creatorid === userName)[0].content
    : "";

type TranscriberProps = {
  story_id: string;
  atExit: () => void;
};

const Transcriber: React.FC<TranscriberProps> = ({ story_id, atExit }) => {
  const [chunks] = chunksContext.useChunksState();

  const {
    progressState: [, setProgress],
    splitState: [, setSplit],
    controller,
  } = useVideoPlayerController();

  const { userName } = useContext(UserContext);

  const [transcription, setTranscription] = useState("");

  const { page, goTo } = useSlideshow(chunks);

  useEffect(() => {
    userName && setTranscription(getUsersTranscription(chunks[page], userName));
    setSplit({
      start: chunks[page].starttimeseconds,
      end: chunks[page].endtimeseconds,
    });
    setProgress(chunks[page].starttimeseconds);
  }, [chunks, page, userName]);

  const updateTranscription = useUpdateTranscription();

  const classes = useStyles();

  const inputRef = useRef(null);

  useEffect(() => {
    (inputRef.current
      ? (inputRef.current as any)
      : { focus: () => null }
    ).focus();
  }, [page]);

  const overrideTranscription = (oldTranscription: string, newTranscription: string) => setTranscription(newTranscription);

  const {
    attemptingActionWith: attemptingTranscriptionChangeWith,
    attemptAction: tryCopyTranscription,
    cancelAction: cancelCopyTranscription,
    confirmAction: confirmCopyTranscription
  } = useConfirmBeforeAction(overrideTranscription, (oldTranscription) => oldTranscription !== "");

  return (
    <div>
      <div style={{marginTop: "4px"}}>
        <BackButton
          action={() => {
            userName &&
              updateTranscription(chunks[page], transcription, userName);
            atExit();
          }}
        />
      </div>
      {chunks.length && (
        <>
          <CentralModal
            exit={cancelCopyTranscription}
            header={
              <WarningMessage message={"You Will Lose Your Transcription"} />
            }
            open={attemptingTranscriptionChangeWith !== undefined}
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
              url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
              controller={controller}
            />
          </Box>
          <div>
            <Slideshow
              onNavBack={() => {
                userName &&
                  updateTranscription(chunks[page], transcription, userName);
                goTo("prev");
              }}
              onNavForward={() => {
                userName &&
                  updateTranscription(chunks[page], transcription, userName);
                goTo("next");
              }}
              currentPage={page}
              numberOfPages={chunks.length}
              onComplete={atExit}
            >
              <ChunkCard chunk={chunks[page]}>
                <TextField
                  autoFocus
                  multiline
                  inputRef={inputRef}
                  className={classes.inputField}
                  variant="outlined"
                  rows={3}
                  label="Transcription"
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                />
              </ChunkCard>
            </Slideshow>
            <div>
              {chunks[page].transcriptions
                .filter((transcription) => transcription.creatorid !== userName)
                .map((t) => (
                  <SimpleCard
                    key={t.creatorid}
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ fontSize: "1.2rem" }}>
                          <span style={{ fontWeight: "bold" }}>Author:</span>
                          {t.creatorid}
                        </div>
                        <IndabaButton
                          onClick={() =>
                            tryCopyTranscription(transcription, t.content)
                          }
                          style={{
                            padding: "0px",
                            height: "32px",
                            width: "32px",
                            minWidth: "32px",
                          }}
                        >
                          <FileCopy fontSize="small" />
                        </IndabaButton>
                      </div>
                    }
                    style={{ margin: "16px 0 16px 0" }}
                  >
                    {t.content}
                  </SimpleCard>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Transcriber;
