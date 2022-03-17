import { SelectOption } from 'components/form/SingleSelect';
import { useFetchMnemonics } from 'modules/master/hook';
import { useEffect, useMemo, useState } from 'react';

export const useMnemonicOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const dataHook = useFetchMnemonics({
    pageNumber: 1,
    pageSize: 50,
  });

  const mnemonicOptions = useMemo<SelectOption[]>(
    () =>
      dataHook.data?.items.map((item) => ({
        value: item.mnemonicId,
        label: item.description,
      })) || [],
    [dataHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(mnemonicOptions);
  }, [mnemonicOptions]);

  return [selectOptions];
};
