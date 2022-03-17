import { SelectOption } from 'components/form/SingleSelect';
import { useFetchMaterialGroups } from 'modules/master/hook';
import { useEffect, useMemo, useState } from 'react';

export const useMaterialGroupOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const dataHook = useFetchMaterialGroups({
    pageNumber: 1,
    pageSize: 50,
  });

  const materialGroupOptions = useMemo<SelectOption[]>(
    () =>
      dataHook.data?.items.map((item) => ({
        value: item.materialGroupCodeId,
        label: item.description,
      })) || [],
    [dataHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(materialGroupOptions);
  }, [materialGroupOptions]);

  return [selectOptions];
};
