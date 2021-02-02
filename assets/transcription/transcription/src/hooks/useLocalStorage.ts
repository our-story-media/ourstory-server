import { useState } from "react";
import { StateSetter } from "../utils/types";
import useToggle from "./useToggle";

const useLocalStorage = (key: string): [string | null, StateSetter<string | null>, () => void] => {
  // This is the state for the value in the local storage
  const [state, setState] = useState<string | null>(window.localStorage.getItem(key));
  // State for whether the initial fetch from local storage has been attempted
  const [fetched, toggleFetched] = useToggle(false);

  if (!fetched) {
    const item = window.localStorage.getItem(key);
    toggleFetched();
    item && setState(item);
  }

  const setToStorage = (setter: (string | null) | ((oldVal: null | string) => string | null)) => {
    if (typeof setter == "string" || setter === null) {
      setState(setter);
      window.localStorage.setItem(key, setter ?? "");
    } else if (setter) {
      setState((old_val) => {
        const new_val = setter(old_val);
        window.localStorage.setItem(key, new_val ?? "");
        return new_val;
      })
    }
  }

  const clearStorage = () => {
      window.localStorage.removeItem(key);
      setState(null);
  };

  return [state, setToStorage, clearStorage];
};

export default useLocalStorage;