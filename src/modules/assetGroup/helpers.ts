import { SelectOption } from 'components/form/SingleSelect';

import { useFetchAssetGroups } from './hook';

export const useAssetGroupOptions = () => {
  const dataHookAssetGroups = useFetchAssetGroups({ pageSize: 50 });
  const assetGroupOptions: SelectOption[] =
    dataHookAssetGroups.data?.items.map((item) => ({
      value: item.id,
      label: item.assetGroup,
    })) || [];

  return assetGroupOptions;
};
