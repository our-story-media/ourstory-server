import { useReducer } from "react";

enum IndexAction {
  NextIndex,
  PrevIndex,
}

const reduceIndex = <T extends unknown>(list: T[]) => (
  state: number,
  action: IndexAction
) => {
  switch (action) {
    case IndexAction.NextIndex:
      return state < list.length - 1 ? state + 1 : state;
    case IndexAction.PrevIndex:
      return state > 0 ? state - 1 : state;
  }
};

/**
 * Hook for having state be an index into a list of elements.
 * Supports making a call to a callback on change, supplying the previous
 * and new index values.
 */
const useListIndexController = <T extends unknown>(
  list: T[]
): {
  nextIndex: () => void;
  prevIndex: () => void;
  nextIndexPossible: boolean;
  prevIndexPossible: boolean;
  currentIndex: number;
  currentValue: T;
} => {
  const [index, dispatchIndex] = useReducer(reduceIndex(list), 0);

  return {
    nextIndex: () => dispatchIndex(IndexAction.NextIndex),
    prevIndex: () => dispatchIndex(IndexAction.PrevIndex),
    nextIndexPossible: index < list.length - 1,
    prevIndexPossible: index > 0,
    currentIndex: index,
    currentValue: list[index],
  };
};

export default useListIndexController;
