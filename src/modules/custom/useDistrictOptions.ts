import { SelectOption } from 'components/form/SingleSelect';
import { useFetchDistricts } from 'modules/master/hook';
import { useEffect, useMemo, useState } from 'react';

export const useDistrictOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const districtHook = useFetchDistricts({
    pageNumber: 1,
    pageSize: 50,
  });

  const districtOptions = useMemo<SelectOption[]>(
    () =>
      districtHook.data?.items.map((item) => ({
        value: item.code,
        label: item.districtName,
      })) || [],
    [districtHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(districtOptions);
  }, [districtOptions]);

  return [selectOptions];
};
