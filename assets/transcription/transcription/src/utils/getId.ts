import { useEffect, useState } from "react";

// const story_id = "5cd5f30e82d5b02a00cfcea3"; // window.location.href.split('/')[5].split('?')[0];

export const useStoryId = (useVidOne: boolean) => {
  const [story_id, set_story_id] = useState(
    useVidOne ? "5cd5f30e82d5b02a00cfcea3" : "5cd5f30e82d5b02a00cfcea4"
  );

  useEffect(() => {
    set_story_id(useVidOne ? "5cd5f30e82d5b02a00cfcea3" : "5cd5f30e82d5b02a00cfcea4");
  }, [useVidOne]);

  return story_id
};

// export default story_id;
