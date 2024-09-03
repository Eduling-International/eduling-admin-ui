import { useEffect, useState } from 'react';

const useDebounce = <T>(
  value: T,
  delay: number,
  callback: (value: T) => Promise<void>,
) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(async () => {
      setDebouncedValue(value);
      await callback(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
