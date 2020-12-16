import { ReactElement, useEffect, useMemo, useState } from "react";

/**
 * A hook to get rid of the boilerplate of writing a switch statement for
 * conditional rendering. Simply maps values to views. Accepts a value,
 * whenever that value changes, returns the corresponding view (according
 * to the map)
 *
 * @param value - the value to check for equality
 * @param conditions - the condition, element mappings
 */
const useConditionalRender = <T extends unknown>(
  value: T,
  conditions: [T, ReactElement][]
): ReactElement | undefined => {
  const map = useMemo(() => new Map<T, ReactElement>(conditions), [conditions]);

  const [view, setView] = useState<ReactElement | undefined>(undefined);

  useEffect(() => {
    setView(map.get(value));
  }, [value, map]);
  return view;
};

export default useConditionalRender;
