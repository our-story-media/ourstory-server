import { useCallback, useState } from "react";
import useTimeout from "./useTimeout";

const useThrottle = <T extends (...args: any) => void>(
  fn: T,
  time: number
): { throttledFn: (...args: Parameters<T>) => void, flush: () => void } => {
  const [flush, setFlush] = useState<(() => void)>(() => () => null)

  const { startTimer, timerActive } = useTimeout(time, ()=>null);

  return {
    throttledFn: (...args: Parameters<T>) => {
      setFlush(() => () => fn(...args));
      if (!timerActive) {
        startTimer();
        fn(...args);
      }
    },
    flush
  };
};

export default useThrottle;
