import { SelectOption } from 'components/form/SingleSelect';
import { useFetchEmployees } from 'modules/master/hook';
import { useEffect, useMemo, useState } from 'react';

export const useEmployeeOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const dataHook = useFetchEmployees({
    pageNumber: 1,
    pageSize: 50,
  });

  const employeeOptions = useMemo<SelectOption[]>(
    () =>
      dataHook.data?.items.map((item) => ({
        value: item.accountDomain,
        label: item.name,
      })) || [],
    [dataHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(employeeOptions);
  }, [employeeOptions]);

  return [selectOptions];
};
