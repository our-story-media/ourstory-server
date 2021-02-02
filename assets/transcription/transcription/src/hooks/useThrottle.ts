import useTimeout from "./useTimeout";

const useThrottle = <T extends (...args: any) => void>(
  fn: T,
  time: number
): ((...args: Parameters<T>) => void) => {
  const { startTimer, timerActive } = useTimeout(time, () => null);

  return (...args: Parameters<T>) => {
    if (!timerActive) {
      startTimer();
      fn(...args);
    }
  };
};

export default useThrottle;
