import { useCallback, useEffect, useRef } from "react";

const useTimeout = <T extends (...args: any) => void>(
  timeUntilFire: number,
  callback: T
): {
  startTimer: (...args: Parameters<T>) => void;
  cancelTimer: () => void;
  resetTimer: (...args: Parameters<T>) => void;
} => {
  const timer = useRef<null | NodeJS.Timeout>(null);

  const memoCallback = useCallback(callback, []);

  const startTimer = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current === null) {
        timer.current = setTimeout(() => {
          timer.current = null;
          memoCallback(...args);
        }, timeUntilFire);
      }
    },
    [timeUntilFire, memoCallback]
  );

  const cancelTimer = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    return cancelTimer;
  }, [cancelTimer]);

  const resetTimer = (...args: Parameters<T>) => {
    cancelTimer();
    startTimer(...args);
  };

  return {
    startTimer,
    cancelTimer,
    resetTimer,
  };
};

export default useTimeout;
