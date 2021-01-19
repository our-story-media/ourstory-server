import { Close } from "@material-ui/icons";
import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from "react";
import { useCropChunk } from "../../utils/ChunksContext/chunksActions";
import story_id from "../../utils/getId";
import { Chunk } from "../../utils/types";
import IndabaButton from "../IndabaButton/IndabaButton";
import IndabaSlider from "../IndabaSlider/IndabaSlider";
import { UserContext } from "../UserProvider/UserProvider";
import useVideoPlayerController from "../VideoPlayer/Hooks/useVideoPlayerController";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

const CropThumbComponent: React.FC<{}> = (props) => {
  const isProgressThumb = (props as any)["data-index"] === 1;
  return (
    <span
      {...props}
      style={{
        ...(props as any).style,
        transform:
          isProgressThumb ? "0" : "translateY(14px)",
        backgroundColor:
          !isProgressThumb ? "#f77965" : "#d9534f",
      }}
    >
      {!isProgressThumb ? (
        <div
          style={{
            height: "14px",
            width: "4px",
            transform: "translateY(-9px)",
            backgroundColor: "#f77965",
          }}
        />
      ) : null}
    </span>
  );
};

type ChunkCropperProps = {
  chunk: Chunk;
  exit: () => void;
  storyDuration: number;
};

const ChunkCropper: React.FC<ChunkCropperProps> = ({
  chunk,
  exit,
  storyDuration,
}) => {
  const {
    progressState: [cropPlayerProgress, setCropPlayerProgress],
    controller: cropPlayerController,
  } = useVideoPlayerController();

  const [videoSplit, setVideoSplit] = useState([0, 0] as [number, number]);
  const [croppedSplit, setCroppedSplit] = useState([0, 0] as [number, number]);

  /* Set initial state based on props  */
  useEffect(() => {
    setCropPlayerProgress(chunk.starttimeseconds);
    const start = chunk.starttimeseconds - 2 / storyDuration;
    const end = chunk.endtimeseconds + 2 / storyDuration;
    setVideoSplit([start < 0 ? 0 : start, end > 1 ? 1 : end]);
    setCroppedSplit([chunk.starttimeseconds, chunk.endtimeseconds]);
  }, [chunk.starttimeseconds, chunk.endtimeseconds, storyDuration]);

  const { userName } = useContext(UserContext);
  const cropChunk = useCropChunk();

  return (
    <div>
      <IndabaButton
        onClick={() => {
          userName && cropChunk(chunk, storyDuration, croppedSplit, userName);
          exit();
        }}
      >
        <Close />
      </IndabaButton>
      <VideoPlayer
        url={`http://localhost:8845/api/watch/getvideo/${story_id}`}
        controller={cropPlayerController}
        slider={
          <IndabaSlider
            value={[
              croppedSplit[0] * 100,
              cropPlayerProgress * 100,
              croppedSplit[1] * 100,
            ]}
            min={videoSplit[0] * 100}
            max={videoSplit[1] * 100}
            step={0.0001}
            ThumbComponent={CropThumbComponent}
            onChange={
              ((_: any, newValue: number | number[]) => {
                setCroppedSplit([
                  (newValue as number[])[0] / 100,
                  (newValue as number[])[2] / 100,
                ]);
                setCropPlayerProgress((newValue as number[])[1] / 100);
              }) as ((
                event: ChangeEvent<{}>,
                value: number | number[]
              ) => void) &
                ((event: FormEvent<HTMLSpanElement>) => void)
            }
          />
        }
      />
    </div>
  );
};

export default ChunkCropper;