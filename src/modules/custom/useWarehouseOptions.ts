import { SelectOption } from 'components/form/SingleSelect';
import { useFetchWarehouses } from 'modules/master/hook';
import { useEffect, useMemo, useState } from 'react';

export const useWarehouseOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const dataHook = useFetchWarehouses({
    pageNumber: 1,
    pageSize: 50,
  });

  const warehouseOptions = useMemo<SelectOption[]>(
    () =>
      dataHook.data?.items.map((item) => ({
        value: item.warehouseId,
        label: item.description,
      })) || [],
    [dataHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(warehouseOptions);
  }, [warehouseOptions]);

  return [selectOptions];
};
