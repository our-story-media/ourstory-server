import { useEffect, useState } from "react";
import { StateSetter } from "../utils/types";
import useToggle from "./useToggle";

const useLocalStorage = (key: string): [string | null, StateSetter<string | null>, () => void] => {
  // This is the state for the value in the local storage
  const [state, setState] = useState<string | null>(null);
  // State for whether the initial fetch from local storage has been attempted
  const [fetched, toggleFetched] = useToggle(false);

  useEffect(() => {
    if (!fetched) {
      const item = window.localStorage.getItem(key);
      toggleFetched();
      item && setState(item);
    } else {
      state && window.localStorage.setItem(key, state);
    }
  }, [state, fetched, key, toggleFetched]);

  const clearStorage = () => {
      window.localStorage.removeItem(key);
      setState(null);
  };

  return [state, setState, clearStorage];
};

export default useLocalStorage;