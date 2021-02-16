import { useEffect, useState } from "react";

export const useStoryId = () => {
  const [storyId, setStoryId] = useState("");

  useEffect(() => {
    setStoryId(window.location.href.split('/')[4]);
  }, []);

  return storyId
};

// export default story_id;
