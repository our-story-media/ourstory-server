import { useEffect, useMemo, useState } from "react";
import useTimeout from "./useTimeout";

const useDebounce = <T extends any>(val: T, time: number): T => {
  const [debouncedVal, setDebouncedVal] = useState(useMemo(() => val, []));

  const { startTimer, cancelTimer, resetTimer } = useTimeout(
    time,
    (newVal: T) => {
      console.log(`Debouncing ${newVal}`);
      setDebouncedVal(newVal);
    }
  );

  useEffect(() => {
    startTimer(val);
    resetTimer(val);
  }, [val]);

  return debouncedVal;
};

export default useDebounce;
