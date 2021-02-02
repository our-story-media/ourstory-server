import useTimeout from "./useTimeout";
import useToggle from "./useToggle";

const useThrottle = <T extends (...args: any) => any>(
  time: number,
  fn: T
): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
  const [lock, toggleLock, setLock] = useToggle(false);

  const { startTimer } = useTimeout(time, toggleLock);

  const onFunctionCalled = () => {
    setLock(true);
    startTimer();
  }

  return (...args: Parameters<T>) => {
    onFunctionCalled();
    return lock ? undefined : fn(...args);
  }
};

export default useThrottle;
