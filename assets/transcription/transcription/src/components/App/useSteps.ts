import { useMemo } from "react";
import { StepInfoProps } from "./StepInfo";
import View from "./Views";

const useSteps = (setView: (view: View) => void): StepInfoProps[] => useMemo(
    () => [
      {
        title: "Chunking",
        description:
          "We need to know when people are talking in the story, so that we can transcribe them.",
        progress: 10,
        onSelect: () => setView(View.Chunking),
      },
      {
        title: "Transcription",
        description:
          "Writing down exactly what is said in each chunk of the story.",
        progress: 10,
        onSelect: () => setView(View.Transcribing),
      },
      {
        title: "Review",
        description:
          "Reviewing content is key to making sure we represent participants authentically.",
        progress: 10,
        onSelect: () => setView(View.Reviewing),
      },
    ],
    [setView]
  );

export default useSteps;