// External Dependencies
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

// Internal Dependencies
import api_key from "../../../utils/getApiKey";
import story_id from "../../../utils/getId";
import { Chunk, State, Story } from "../../../utils/types";

type ServerData = {
  data: Story
}

/**
 * This hook synchronizes the chunks being created and edited in the user
 * interface with the ourstory backend
 * 
 * @param chunks - the chunks state to synchonise to the api
 * @param setChunks - setter for the chunks
 */
const useOurstoryApi = (): { storyTitle: string | undefined, chunksState: State<Chunk[]> }  => {
  const [story, setStory] = useState<Story | undefined>(undefined);
  const [chunks, setChunks] = useState<Chunk[]>([]);

  useEffect(() => {
    axios.request<Story>({
      url: `http://localhost:8845/api/watch/edit/${story_id}`,
      transformResponse: (r: string) => JSON.parse(r)
    }).then((response) => {setStory(response.data); setChunks(response.data.transcription ? response.data.transcription.chunks : []); })
  //   axios
  //     .get(`http://localhost:8845/api/watch/edit/${story_id}`)
  //     .then((r) => {
  //       r.data.transcription &&
  //         setChunks(
  //           r.data.transcription.chunks.map((c: any) => ({
  //             starttimestamp: c.starttimestamp,
  //             starttimeseconds: c.starttimeseconds,
  //             endtimestamp: c.endtimestamp,
  //             endtimeseconds: c.endtimeseconds,
  //             creatorid: c.creatorid,
  //             updatedat: c.updatedat,
  //             id: c.id,
  //             transcriptions: c.transcriptions,
  //           }))
  //         );
  //       setStory({ ...r.data, loading: false });
  //     })
  //     .catch((error) => console.log(error)); // TODO Handle errors more eloquently
  }, [setChunks]);

  // useEffect(() => {
  //   console.log({ ...story, transcription: { chunks } });
  //   !story.loading &&
  //     axios
  //       .post(
  //         `http://localhost:8845/api/watch/savedit/${story_id}?apikey=${api_key}`,
  //         { ...story, transcription: { chunks } }
  //       )
  //       .catch((error) => console.log(error));
  // }, []);

  const memoChunks = useMemo<State<Chunk[]>>(() => [chunks, setChunks], [chunks]);

  return { storyTitle: story && story.title, chunksState: memoChunks };
};

export default useOurstoryApi;