import { Profile } from 'modules/profile/entities';
import { useEffect, useState } from 'react';
import { decodeToken } from 'utils/token';

export const useDecodeToken = () => {
  const [storedValue, setStoredValue] = useState<Profile>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const decodedToken = decodeToken(token);

    if (decodedToken) {
      setStoredValue(decodedToken);
    }
  }, []);

  return [storedValue];
};
