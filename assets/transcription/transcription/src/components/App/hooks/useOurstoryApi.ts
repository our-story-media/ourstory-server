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

  const pushStoryChanges = (new_story: Story) => {
    axios.request<Story>({
      url: `http://${api_base_address}:8845/api/watch/savedit/${story_id}?apikey=${api_key}`,
      method: "POST",
      withCredentials: true,
      data: new_story,
    });
  };

  const setChunksWithUpdate = async (
    setter: (new_chunks: Chunk[]) => Chunk[]
  ) => {
    const new_chunks = setter(
      (
        await axios.request<Chunk[]>({
          withCredentials: true,
          url: `http://${api_base_address}:8845/api/watch/edit/${story_id}`,
          transformResponse: (r: string) =>
            (JSON.parse(r) as Story).transcription.chunks,
        })
      ).data
    );

    const new_story =
      story === undefined
        ? undefined
        : { ...story, transcription: { chunks: new_chunks } };

    setStory(new_story);
    new_story && pushStoryChanges(new_story);
  };

  // const setWithUpdnew_chunksc;(setter: (state: Chunk[]) => Chunk[]) => {
  //   console.log(`Setting Chunks with update for story: ${story_id}`)
  //   setChunks(
  //     setter(
  //       (
  //         await axios
  //           .request<Chunk[]>({
  //             withCredentials: true,
  //             url: `http://${api_base_address}:8845/api/watch/edit/${story_id}`,
  //             transformResponse: (r: string) =>
  //               (JSON.parse(r) as Story).transcription.chunks,
  //           })
  //           .catch(() => ({ data: chunks }))
  //       ).data
  //     )
  //   );
  // };

  useEffect(() => {
    console.log(
      `Story_id has changed, fetching story and chunks for story_id: ${story_id}`
    );
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

  const memoChunks = useMemo<
    [Chunk[], (setter: (newState: Chunk[]) => Chunk[]) => void]
  >(() => [chunks, setChunksWithUpdate], [chunks]);

  return {
    storyTitle: story && story.title,
    chunksState: memoChunks,
  };
};

export default useOurstoryApi;
