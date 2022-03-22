import { useState } from "react";
import { State } from "../utils/types";

/**
 * Hook for using React state if some external state isn't provided
 */
const useDefaultState = <T extends unknown>(optional: State<T> | undefined, defaultState: T) => {
    const def = useState(defaultState);
    return optional ?? def;
}

export default useDefaultState;