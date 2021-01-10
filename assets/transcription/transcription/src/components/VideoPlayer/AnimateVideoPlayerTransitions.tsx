import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useState } from "react";
import { act } from "react-dom/test-utils";
import { StateSetter } from "../../utils/types";
import { SplitState } from "./Hooks/useVideoPlayerState";
import VideoPlayer, {
  VideoPlayerControllerType,
  VideoPlayerProps,
} from "./VideoPlayer";

type AnimateVideoPlayerTransitionsProps = {
  direction: "next" | "prev";
  controller: VideoPlayerControllerType;
};

/**
 * A VideoPlayer that animates whenever it's splitstate changes
 */
const AnimateVideoPlayerTransitions: React.FC<
  VideoPlayerProps & AnimateVideoPlayerTransitionsProps
> = ({ url, controller, direction }) => {
  const [activePlayer, setActivePlayer] = useState<"one" | "two">("one");
  const videoOneControls = useAnimation();
  const videoTwoControls = useAnimation();
  const {
    splitState: [split, setSplit],
    progressState: [progress, setProgress],
  } = controller;

  const [splitDelta, setSplitDelta] = useState({
    current: { ...split },
    prev: { ...split },
  });

  const [progressDelta, setProgressDelta] = useState({
    current: { ...progress },
    prev: { ...progress },
  });

  useEffect(() => {
    setSplitDelta((d) => ({ current: { ...split }, prev: { ...d.current } }));
    setProgressDelta((d) => ({
      current: { ...progress },
      prev: { ...d.current },
    }));
    const toDismiss =
      activePlayer === "one" ? videoOneControls : videoTwoControls;
    const toSummon =
      activePlayer === "two" ? videoOneControls : videoTwoControls;
    toSummon.set({ x: direction === "next" ? "100vw" : "-100vw" });
    toSummon.start({ x: 0 });
    toDismiss.start({ x: direction === "next" ? "-100vw" : "100vw" });
  }, [split.start]);

  useEffect(() => {
    setActivePlayer((p) => (p === "one" ? "two" : "one"));
  }, [splitDelta]);
  const transition = { ease: [0.6, 0.05, -0.01, 0.99] };
  return (
    <>
      <motion.div animate={videoOneControls} transition={transition}>
        <VideoPlayer
          url={url}
          controller={{
            ...controller,
            splitState:
              activePlayer === "two"
                ? [splitDelta.prev, setSplit]
                : [split, setSplit],
            progressState:
              activePlayer === "two"
                ? [progressDelta.prev, setProgress]
                : [progress, setProgress],
          }}
        />
      </motion.div>
      <motion.div
        animate={videoTwoControls}
        transition={transition}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: "translatex(-100vw)",
        }}
      >
        <VideoPlayer
          url={url}
          controller={{
            ...controller,
            splitState:
              activePlayer === "one"
                ? [splitDelta.prev, setSplit]
                : [split, setSplit],
            progressState:
              activePlayer === "one"
                ? [progressDelta.prev, setProgress]
                : [progress, setProgress],
          }}
        />
      </motion.div>
    </>
  );
};

export default AnimateVideoPlayerTransitions;
