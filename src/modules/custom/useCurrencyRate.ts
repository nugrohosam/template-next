import { useState } from 'react';

// TODO: Kurs masih dummy, nanti request API
export const useCurrencyRate = () => {
  const [currencyRate, setCurrencyRate] = useState<number>(14500);

  return { currencyRate, setCurrencyRate };
};
