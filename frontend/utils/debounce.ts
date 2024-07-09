import { useEffect, useRef } from "react";

function useDebounce(callback: () => void, delay: number, dependencies: any[]) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...dependencies, delay]);
}

export { useDebounce };
