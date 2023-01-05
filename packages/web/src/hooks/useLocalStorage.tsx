import { useState, useEffect } from 'react';

export const useLocalStorage = () => {
  const [item, setItem] = useState<Record<string, string> | null>(
    JSON.parse(localStorage.getItem('postie')) ?? null
  );

  useEffect(() => {
    localStorage.setItem('postie', JSON.stringify(item));
  }, [item]);

  return [item, setItem];
};
