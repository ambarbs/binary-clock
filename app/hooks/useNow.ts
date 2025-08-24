import { useEffect, useRef, useState } from "react";

/**
 * useNow — returns a Date that updates every `refreshMs` milliseconds.
 */
export default function useNow(refreshMs = 250) {
  const [now, setNow] = useState(() => new Date());
  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    if (intervalId.current) window.clearInterval(intervalId.current);
    intervalId.current = window.setInterval(
      () => setNow(new Date()),
      refreshMs
    );
    return () => {
      if (intervalId.current) window.clearInterval(intervalId.current);
    };
  }, [refreshMs]);

  return now;
}
