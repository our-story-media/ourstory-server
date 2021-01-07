// External Dependencies
import { Box, Container, TextField } from "@material-ui/core";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// Internal Dependencies
import oneSatisfies from "../../utils/oneSatisfies";
import { Chunk } from "../../utils/types";
import ChunkCard from "../ChunkCard/ChunkCard";
import { UserContext } from "../UserProvider/UserProvider";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import useStyles from "./TranscriberStyles";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import useSlideshow from "../../hooks/useSlideshow";
import { useUpdateTranscription } from "../../utils/ChunksContext/chunksActions";
import chunksContext from "../../utils/ChunksContext/chunksContext";
import Slideshow from "../Slideshow/Slideshow";

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

  const videoTwoAnimationControls = useAnimation();
  const videoOneAnimationControls = useAnimation();
  type ActiveVideo = "one" | "two";
  const [activeVideo, setActiveVideo] = useState<ActiveVideo>("one");
  const toggleActiveVideo = () =>
    setActiveVideo((s) => (s === "one" ? "two" : "one"));
  type VideoChange = "left" | "right";
  const ease = [0.6, 0.05, -0.01, 0.99];
  const animateVideoChange = (change: VideoChange) => {
    videoOneAnimationControls.stop();
    videoTwoAnimationControls.stop();

    (activeVideo === "one"
      ? videoTwoAnimationControls
      : videoOneAnimationControls
    ).set({ x: change === "left" ? "-100vw" : "100vw" });

    (activeVideo === "one"
      ? videoOneAnimationControls
      : videoTwoAnimationControls
    ).set({ x: 0 });

    (activeVideo === "one"
      ? videoTwoAnimationControls
      : videoOneAnimationControls
    ).start({ x: 0, transition: { ease: ease } });

    (activeVideo === "one"
      ? videoOneAnimationControls
      : videoTwoAnimationControls
    )
      .start({
        x: change === "left" ? "100vw" : "-100vw",
        transition: { ease: ease },
      })
      .then(toggleActiveVideo);
  };

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

  return (
    <Container>
      {backButton}
      {chunks.length && (
        <>
          <Box className={classes.videoPlayerContainer}>
            <motion.div animate={videoOneAnimationControls}>
              <VideoPlayer
                url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
                controller={controller}
              />
            </motion.div>
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transform: "translateX(-100vw)",
              }}
              animate={videoTwoAnimationControls}
            >
              <VideoPlayer
                url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
                controller={controller}
              />
            </motion.div>
          </Box>
          <Slideshow
            onNavBack={() => {
              animateVideoChange("left");
              userName &&
                updateTranscription(chunks[page], transcription, userName);
              goTo("prev");
            }}
            onNavForward={() => {
              animateVideoChange("right");
              userName &&
                updateTranscription(chunks[page], transcription, userName);
              goTo("next");
            }}
            currentPage={page}
            numberOfPages={chunks.length}
          >
            <ChunkCard chunk={chunks[page]}>
              <TextField
                multiline
                className={classes.inputField}
                variant="outlined"
                rows={3}
                label="Transcription"
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
              />
            </ChunkCard>
          </Slideshow>
        </>
      )}
    </Container>
  );
};

export default Transcriber;
