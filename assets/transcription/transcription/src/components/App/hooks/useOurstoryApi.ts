// External Dependencies
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

// Internal Dependencies
import api_key from "../../../utils/getApiKey";
import story_id from "../../../utils/getId";
import { Chunk, Story } from "../../../utils/types";

/**
 * This hook synchronizes the chunks being created and edited in the user
 * interface with the ourstory backend
 *
 * setChunks refetches the chunks from the server everytime it is called
 *
 * @param chunks - the chunks state to synchonise to the api
 * @param setChunks - setter for the chunks
 */
const useOurstoryApi = (): {
  storyTitle: string | undefined;
  chunksState: [Chunk[], (setter: (newState: Chunk[]) => Chunk[]) => void];
} => {
  const [story, setStory] = useState<Story | undefined>(undefined);
  const [chunks, setChunks] = useState<Chunk[]>([]);

  const setWithUpdate = async (setter: (state: Chunk[]) => Chunk[]) => {
    setChunks(
      setter(
        (
          await axios.request<Chunk[]>({
            url: `http://localhost:8845/api/watch/edit/${story_id}`,
            transformResponse: (r: string) =>
              (JSON.parse(r) as Story).transcription.chunks,
          })
        ).data
      )
    );
  };

  useEffect(() => {
    axios
      .request<Story>({
        url: `http://localhost:8845/api/watch/edit/${story_id}`,
        transformResponse: (r: string) => JSON.parse(r),
      })
      .then((response) => {
        setStory(response.data);
        setChunks(
          response.data.transcription ? response.data.transcription.chunks : []
        );
      });
  }, []);

  useEffect(() => {
    story &&
      axios.request<Story>({
        url: `http://localhost:8845/api/watch/savedit/${story_id}?apikey=${api_key}`,
        method: "POST",
        data: { ...story, transcription: { chunks } },
      });
  }, [chunks, story]);

  const memoChunks = useMemo<
    [Chunk[], (setter: (newState: Chunk[]) => Chunk[]) => void]
  >(() => [chunks, setWithUpdate], [chunks]);

  return {
    storyTitle: story && story.title,
    chunksState: memoChunks,
  };
};

export default useOurstoryApi;
