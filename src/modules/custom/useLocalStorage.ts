import { useEffect, useState } from 'react';

export const useLocalStorage = (key: string) => {
  const [storedValue, setStoredValue] = useState<Record<string, any>>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    setStoredValue(data);
  }, [key]);

  return [storedValue];
};
