import { useState } from "react";
import { State, StateSetter } from "../../../utils/types";
import { VideoPlayerControllerType } from "../VideoPlayer";
import { ProgressState } from "./useVideoPlayerState";

/**
 * This hook is used for when the user of the VideoPlayer component wants to
 * be able to externally control the state of the player. It provides the means
 * to read and write progress and playing states, read the duration state and 
 * the controller object to be passed to the VideoPlayer component
 */
const useVideoPlayerController = (): {
    progressState: State<number>,
    playingState: State<boolean>,
    duration: number,
    controller: VideoPlayerControllerType,
} => {
    const [progressState, setProgressState] = useState<ProgressState>({ progress: 0, fromPlayer: false});

    const externalSetProgress: StateSetter<number> = (setter: number | ((state: number) => number)) =>
        typeof setter == "number" ? setProgressState({ progress: setter, fromPlayer: false}) : setProgressState(state => ({ progress: setter(state.progress), fromPlayer: false }))

    const [duration, setDuration] = useState(0);

    const playingState = useState(false);

    return { progressState: [progressState.progress, externalSetProgress], playingState, duration, controller: {progressState: [progressState, setProgressState], durationState: [duration, setDuration], playingState} };
}

export default useVideoPlayerController;