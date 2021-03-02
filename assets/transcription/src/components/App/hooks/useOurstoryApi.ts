// External Dependencies
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

// Internal Dependencies
import api_key, { api_base_address } from "../../../utils/getApiKey";
import { Chunk, Story } from "../../../utils/types";

const pushStoryChanges = (new_story: Story, story_id: string) => {
  const url = `${api_base_address}/api/watch/savedit/${story_id}?apikey=${api_key}`;
  axios.request<Story>({
    url: url,
    method: "POST",
    withCredentials: true,
    data: new_story,
  });
};

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

  const chunks = useMemo(() => story?.transcription.chunks ?? [], [
    story?.transcription?.chunks,
  ]);

  const setChunks = (new_chunks: Chunk[]) => {
    setStory((story) =>
      story === undefined
        ? undefined
        : { ...story, transcription: { chunks: new_chunks } }
    );
  };

  const setChunksWithUpdate = useCallback(
    async (setter: (new_chunks: Chunk[]) => Chunk[]) => {
      const new_chunks = setter(
        (
          await axios.request<Chunk[]>({
            withCredentials: true,
            url: `${api_base_address}/api/watch/edit/${story_id}`,
            transformResponse: (r: string) =>
              (JSON.parse(r) as Story)?.transcription?.chunks ?? [],
          })
        ).data
      );

      setStory((old_story) => {
        const new_story =
          old_story === undefined
            ? undefined
            : { ...old_story, transcription: { chunks: new_chunks } };
        new_story && pushStoryChanges(new_story, story_id);
        return new_story;
      });
    },
    [story_id]
  );

  useEffect(() => {
    axios
      .request<Story>({
        url: `${api_base_address}/api/watch/edit/${story_id}`,
        withCredentials: true,
        transformResponse: (r: string) => JSON.parse(r),
      })
      .then((response) => {
        setStory(response.data);
        setChunks(
          response.data?.transcription?.chunks ?? []
        );
      });
  }, [story_id]);

  const memoChunks = useMemo<
    [Chunk[], (setter: (newState: Chunk[]) => Chunk[]) => void]
  >(() => [chunks, setChunksWithUpdate], [chunks, setChunksWithUpdate]);

  return {
    storyTitle: story && story.title,
    chunksState: memoChunks,
  };
};

export default useOurstoryApi;
