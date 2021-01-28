import { useEffect, useRef } from "react";

const ScrollToOnMount: React.FC<{}> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, []);

  return <div ref={ref}>{children}</div>;
};

export default ScrollToOnMount;
