import { Menu } from 'modules/menu/entities';
import { useEffect, useState } from 'react';

export const useManagementMenu = () => {
  const [storedValue, setStoredValue] = useState<Menu[]>([]);

  useEffect(() => {
    const menu = localStorage.getItem('management');
    if (!menu) {
      return;
    }

    const parseMenu: Menu[] = JSON.parse(menu);
    if (parseMenu) {
      setStoredValue(parseMenu);
    }
  }, []);

  return [storedValue];
};
