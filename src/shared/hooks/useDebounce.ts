import debounce from 'lodash/debounce';
import { useCallback, useEffect } from 'react';

// Type for the callback function (can accept any arguments and return any type)
type Callback<T extends any[]> = (...args: T) => void;

const useDebounce = <T extends any[]>(callback: Callback<T>, delay: number = 300) => {
  // Create a debounced version of the callback
  const debouncedCallback = useCallback(
    debounce((...args: T) => {
      callback(...args);
    }, delay),
    [callback, delay],
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};

export default useDebounce;
