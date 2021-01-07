// External Dependencies
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

// Internal Dependencies
import api_key from "../../../utils/getApiKey";
import story_id from "../../../utils/getId";
import { Chunk, State, Story } from "../../../utils/types";

/**
 * This hook synchronizes the chunks being created and edited in the user
 * interface with the ourstory backend
 *
 * @param chunks - the chunks state to synchonise to the api
 * @param setChunks - setter for the chunks
 */
const useOurstoryApi = (): {
  storyTitle: string | undefined;
  chunksState: State<Chunk[]>;
} => {
  const [story, setStory] = useState<Story | undefined>(undefined);
  const [chunks, setChunks] = useState<Chunk[]>([]);

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
        data: { ...story, transcription: { chunks } }
    })
  }, [chunks, story])

    const memoChunks = useMemo<State<Chunk[]>>(() => [chunks, setChunks], [
    chunks,
  ]);

  return { storyTitle: story && story.title, chunksState: memoChunks };
};

export default useOurstoryApi;
