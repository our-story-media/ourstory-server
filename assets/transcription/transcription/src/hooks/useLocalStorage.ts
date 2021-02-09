import { useCallback, useState } from "react";
import { StateSetter } from "../utils/types";
import useToggle from "./useToggle";

const useLocalStorage = (key: string, defaultValue?: string): [string | undefined, StateSetter<string | undefined>, () => void] => {
  // This is the state for the value in the local storage
  const [state, setState] = useState<string | undefined>(window.localStorage.getItem(key) ?? defaultValue);
  // State for whether the initial fetch from local storage has been attempted
  const [fetched, toggleFetched] = useToggle(false);

  if (!fetched) {
    const item = window.localStorage.getItem(key);
    toggleFetched();
    item && setState(item);
  }

  const setToStorage = useCallback((setter: (string | undefined) | ((oldVal: undefined | string) => string | undefined)) => {
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
  }, [key]);

  const clearStorage = () => {
      window.localStorage.removeItem(key);
      setState(undefined);
  };

  return [state, setToStorage, clearStorage];
};

export default useLocalStorage;