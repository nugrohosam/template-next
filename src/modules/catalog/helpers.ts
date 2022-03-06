import { SelectOption } from 'components/form/SingleSelect';

import { Catalog } from './entities';
import { useFetchCatalogs } from './hook';

export const useCatalogOptions = (assetGroupId: string) => {
  const dataHookCatalogs = useFetchCatalogs({
    pageSize: 50,
    assetGroupId,
  });
  const catalogOptions: (Catalog & SelectOption)[] =
    dataHookCatalogs.data?.items.map((item) => ({
      value: item.id,
      label: item.detail,
      ...item,
    })) || [];

  return catalogOptions;
};
