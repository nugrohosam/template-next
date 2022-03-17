import { SelectOption } from 'components/form/SingleSelect';
import { useFetchSuppliers } from 'modules/master/hook';
import { useEffect, useMemo, useState } from 'react';

export const useSupplierOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const dataHook = useFetchSuppliers({
    pageNumber: 1,
    pageSize: 50,
  });

  const supplierOptions = useMemo<SelectOption[]>(
    () =>
      dataHook.data?.items.map((item) => ({
        value: item.id,
        label: item.name,
      })) || [],
    [dataHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(supplierOptions);
  }, [supplierOptions]);

  return [selectOptions];
};
