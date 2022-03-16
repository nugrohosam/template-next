import { SelectOption } from 'components/form/SingleSelect';
import { useFetchUom } from 'modules/master/hook';
import { useEffect, useMemo, useState } from 'react';

export const useUomOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const dataHook = useFetchUom({
    pageNumber: 1,
    pageSize: 50,
  });

  const uomOptions = useMemo<SelectOption[]>(
    () =>
      dataHook.data?.items.map((item) => ({
        value: item.uomCode,
        label: item.uomDescription,
      })) || [],
    [dataHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(uomOptions);
  }, [uomOptions]);

  return [selectOptions];
};
