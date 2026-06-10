import { useState, useEffect } from "react";

let idCounter = 1000;
export const genId = () => `custom-${++idCounter}`;

export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
