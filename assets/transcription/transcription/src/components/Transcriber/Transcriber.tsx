// External Dependencies
import { Box, Container, TextField } from "@material-ui/core";
import React, {
  ReactNode,
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

const getUsersTranscription = (chunk: Chunk, userName: string): string =>
  oneSatisfies(chunk.transcriptions, (t) => t.creatorid === userName)
    ? chunk.transcriptions.filter((t) => t.creatorid === userName)[0].content
    : "";

type TranscriberProps = {
  story_id: string;
  makeBackButton: (action: () => void) => ReactNode;
};

const Transcriber: React.FC<TranscriberProps> = ({
  story_id,
  makeBackButton,
}) => {
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

  const backButton = makeBackButton(
    () => userName && updateTranscription(chunks[page], transcription, userName)
  );

  const classes = useStyles();

  const inputRef = useRef(null);

  useEffect(() => {
    (inputRef.current
      ? (inputRef.current as any)
      : { focus: () => null }
    ).focus();
  }, [page]);

  return (
    <div>
      {backButton}
      {chunks.length && (
        <>
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
                .map((transcription) => (
                  <SimpleCard
                    key={transcription.creatorid}
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ fontSize: "1.2rem" }}>
                          <span style={{ fontWeight: "bold" }}>Author:</span>
                          {transcription.creatorid}
                        </div>
                        <IndabaButton style={{padding: "0px", height: "32px", width: "32px", minWidth: "32px"}}>
                          <FileCopy fontSize="small" />
                        </IndabaButton>
                      </div>
                    }
                    style={{ margin: "16px 0 16px 0" }}
                  >
                    {transcription.content}
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
