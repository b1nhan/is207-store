import { useState, useEffect } from 'react';

// ─── useDebounce ──────────────────────────────────────────────────────────────
// Delays updating `debouncedValue` until `delay` ms have passed
// since the last change to `value`.

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
