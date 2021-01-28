// External Dependencies
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

// Internal Dependencies
import api_key, { api_base_address } from "../../../utils/getApiKey";
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
const useOurstoryApi = (
  story_id: string
): {
  storyTitle: string | undefined;
  chunksState: [Chunk[], (setter: (newState: Chunk[]) => Chunk[]) => void];
} => {
  const [story, setStory] = useState<Story | undefined>(undefined);
  const [chunks, setChunks] = useState<Chunk[]>([]);

  const setWithUpdate = async (setter: (state: Chunk[]) => Chunk[]) => {
    setChunks(
      setter(
        (
          await axios
            .request<Chunk[]>({
              withCredentials: true,
              url: `http://${api_base_address}:8845/api/watch/edit/${story_id}`,
              transformResponse: (r: string) =>
                (JSON.parse(r) as Story).transcription.chunks,
            })
            .catch(() => ({ data: chunks }))
        ).data
      )
    );
  };

  useEffect(() => {
    axios
      .request<Story>({
        url: `http://${api_base_address}:8845/api/watch/edit/${story_id}`,
        withCredentials: true,
        transformResponse: (r: string) => JSON.parse(r),
      })
      .then((response) => {
        setStory(response.data);
        setChunks(
          response.data.transcription ? response.data.transcription.chunks : []
        );
      });
  }, [story_id]);

  useEffect(() => {
    story &&
      axios.request<Story>({
        url: `http://${api_base_address}:8845/api/watch/savedit/${story_id}?apikey=${api_key}`,
        method: "POST",
        withCredentials: true,
        data: { ...story, transcription: { chunks } },
      });
  }, [chunks, story, story_id]);

  const memoChunks = useMemo<
    [Chunk[], (setter: (newState: Chunk[]) => Chunk[]) => void]
  >(() => [chunks, setWithUpdate], [chunks]);

  return {
    storyTitle: story && story.title,
    chunksState: memoChunks,
  };
};

export default useOurstoryApi;
