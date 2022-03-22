import { useEffect, useState } from "react";

export const useStoryId = () => {
  const [storyId, setStoryId] = useState("");

  useEffect(() => {
    //console.log(window.location.href.split('/')[4].split('?')[0]);
    let editid = window.location.href.split('editid=')[1].split('&')[0];
    // console.log(editid);
    // if (process.env.NODE_ENV==='production')
    setStoryId(editid);
    // else
      // setStoryId('5cdf38cf6efadf1a00cb0555');
  }, []);

  return storyId
};

// export default story_id;
// http://localhost:8845/transcribe/5cdf38cf6efadf1a00cb0555?apikey=71932364-1925-4130-8e0c-389fa455f37e