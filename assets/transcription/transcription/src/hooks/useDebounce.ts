import { useEffect, useMemo, useState } from "react";
import useTimeout from "./useTimeout";

type NoValue = {};

const useDebounce = <T extends (...args: any) => void>(fn: T, time: number): (...args: Parameters<T>) => void => {
  const { startTimer, resetTimer, timerActive } = useTimeout(
    time,
    fn
  );

  const debounceFn = (...args: Parameters<T>) => {
    timerActive ? resetTimer(...args) : startTimer(...args);
  };

  return debounceFn;
};

export default useDebounce;
