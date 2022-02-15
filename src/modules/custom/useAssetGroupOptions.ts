import { SelectOption } from 'components/form/SingleSelect';
import { useFetchAssetGroups } from 'modules/assetGroup/hook';
import { useEffect, useMemo, useState } from 'react';

export const useAssetGroupOptions = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  const assetGroupHook = useFetchAssetGroups({
    pageNumber: 1,
    pageSize: 50,
  });

  const assetGroupOptions = useMemo<SelectOption[]>(
    () =>
      assetGroupHook.data?.items.map((item) => ({
        value: item.id,
        label: item.assetGroup,
      })) || [],
    [assetGroupHook.data?.items]
  );

  useEffect(() => {
    setSelectOptions(assetGroupOptions);
  }, [assetGroupOptions]);

  return [selectOptions];
};
