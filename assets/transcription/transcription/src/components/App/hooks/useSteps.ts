import { useMemo } from "react";
import { StepInfoProps } from "../StepInfo";
import View from "../Views";

const useSteps = (
  setView: (view: View) => void,
  enabled: { step1: boolean; step2: boolean; step3: boolean }
): StepInfoProps[] =>
  useMemo(
    () => [
      {
        title: "Chunking",
        description:
          "We need to know when people are talking in the story, so that we can transcribe them.",
        progress: 10,
        onSelect: () => setView(View.Chunking),
        enabled: enabled.step1,
      },
      {
        title: "Transcription",
        description:
          "Writing down exactly what is said in each chunk of the story.",
        progress: 10,
        onSelect: () => setView(View.Transcribing),
        enabled: enabled.step2,
      },
      {
        title: "Review",
        description:
          "Reviewing content is key to making sure we represent participants authentically.",
        progress: 10,
        onSelect: () => setView(View.Reviewing),
        enabled: enabled.step3,
      },
    ],
    [setView, enabled.step1, enabled.step2, enabled.step3]
  );

export default useSteps;
