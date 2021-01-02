import { useMemo } from "react";
import { StepInfoProps } from "../StepInfo";
import View from "../Views";

type Three<T> = [T, T, T];

const useSteps = (
  setView: (view: View) => void,
  state: Three<Pick<StepInfoProps, "progress" | "enabled">>
): Three<StepInfoProps> =>
  useMemo(
    () => [
      {
        title: "Chunking",
        description:
          "We need to know when people are talking in the story, so that we can transcribe them.",
        progress: 10,
        onSelect: () => setView(View.Chunking),
        enabled: state[0].enabled,
      },
      {
        title: "Transcription",
        description:
          "Writing down exactly what is said in each chunk of the story.",
        progress: 10,
        onSelect: () => setView(View.Transcribing),
        enabled: state[1].enabled,
      },
      {
        title: "Review",
        description:
          "Reviewing content is key to making sure we represent participants authentically.",
        progress: 10,
        onSelect: () => setView(View.Reviewing),
        enabled: state[2].enabled,
      },
    ],
    [setView, state[0].enabled, state[1].enabled, state[2].enabled]
  );

export default useSteps;
