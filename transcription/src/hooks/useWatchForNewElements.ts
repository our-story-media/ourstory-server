import { useState, useEffect } from "react";

/**
 * Given a stateful list of elements,
 * watches for new elements and calls
 * the callback everytime there's a
 * new element
 */
const useWatchForNewElements = <T extends unknown>(
  elements: T[],
  identifier: (elOne: T, elTwo: T) => boolean,
  action: (newElements: T[]) => void
) => {
  const [prevElements, setPrevElements] = useState([] as T[]);

  useEffect(() => {
    setPrevElements(elements);
  }, []);

  useEffect(() => {
    const newElements = elements.filter(
      (el) => !prevElements.find((prevEl) => identifier(prevEl, el))
    );
    action(newElements);
    setPrevElements(elements);
  }, [elements]);
};

export default useWatchForNewElements;