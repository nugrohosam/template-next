import { useState } from 'react';

// TODO: Kurs masih dummy
export const useKurs = () => {
  const [kurs, setKurs] = useState<number>(14500);

  return { kurs, setKurs };
};
