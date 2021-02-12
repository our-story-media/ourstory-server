import { useCallback, useMemo, useState } from "react";

/**
 * A convenience hook for indexing into a list and only allowing going
 * to the next and previous index.
 *
 * The API tells the user the current page, as well as the direction of the
 * last page change.
 *
 * @param list the list to index into
 */
const useSlideshow = <T extends unknown>(list: T[]) => {
  const [[page, direction], setPage] = useState<
    [number, "next" | "prev" | null]
  >([0, null]);

  const goTo = (direction: "next" | "prev") => {
    return direction === "next" && page < list.length - 1
      ? setPage(([p]) => [p + 1, "next"])
      : direction === "prev" && page > 0
      ? setPage(([p]) => [p - 1, "prev"])
      : null;
  };

  const reset = useCallback(() => {
    setPage([0, null]);
  }, [setPage]);

  const lastPage = useMemo(() => 
    page === list.length - 1
  , [page, list.length]);

  return { page: page, direction: direction, goTo, reset, lastPage };
};

export default useSlideshow;
