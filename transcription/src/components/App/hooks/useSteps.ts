// External Dependencies
import { useMemo } from "react";
import LocalizedStrings from "react-localization";

// Internal Dependencies
import { StepInfoProps } from "../StepInfo";
import View from "../Views";

const strings = new LocalizedStrings({
  en: {
    chunkingDesc:
      "We need to know when people are talking in the story, so that we can transcribe them.",
    chunkingTitle: "Chunking",
    transcriptionDesc:
      "Writing down exactly what is said in each chunk of the story.",
    transcriptionTitle: "Transcription",
    reviewDesc:
      "Reviewing content is key to making sure we represent participants authentically.",
    reviewTitle: "Review",
  },
});

type Three<T> = [T, T, T];

const useSteps = (
  setView: (view: View) => void,
  state: Three<Pick<StepInfoProps, "progress" | "enabled">>
): Three<StepInfoProps> =>
  useMemo(
    () => [
      {
        title: strings.chunkingTitle,
        description: strings.chunkingDesc,
        progress: state[0].progress,
        onSelect: () => setView(View.Chunking),
        enabled: state[0].enabled,
      },
      {
        title: strings.transcriptionTitle,
        description: strings.transcriptionDesc,
        progress: state[1].progress,
        onSelect: () => setView(View.Transcribing),
        enabled: state[1].enabled,
      },
      {
        title: strings.reviewTitle,
        description: strings.reviewDesc,
        progress: state[2].progress,
        onSelect: () => setView(View.Reviewing),
        enabled: state[2].enabled,
      },
    ],
    [setView, state]
  );

export default useSteps;
