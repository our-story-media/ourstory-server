import { useEffect, useRef } from "react";

const ScrollToOnMount: React.FC<{ style?: any }> = ({ children, style }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, []);

  return <div ref={ref} style={{...style}}>{children}</div>;
};

export default ScrollToOnMount;
