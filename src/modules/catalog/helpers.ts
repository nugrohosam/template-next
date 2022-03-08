import { SelectOption } from 'components/form/SingleSelect';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { Catalog, CatalogForm } from './entities';
import { useCreateCatalog, useFetchCatalogs, useUpdateCatalog } from './hook';

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

export const useCatalogHelpers = () => {
  const mutationCreateCatalog = useCreateCatalog();
  const handleCreateCatalog = (data: CatalogForm) => {
    return new Promise((resolve, reject) => {
      mutationCreateCatalog.mutate(data, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data created!');
        },
        onError: (error) => {
          reject(error);
          console.error('Failed to create data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      });
    });
  };

  const mutationUpdateCatalog = useUpdateCatalog();
  const handleUpdateUnbudget = (idCatalog: string, data: CatalogForm) => {
    return new Promise((resolve, reject) => {
      mutationUpdateCatalog.mutate(
        { idCatalog, data },
        {
          onSuccess: (result) => {
            resolve(result);
            toast('Data updated!');
          },
          onError: (error) => {
            reject(error);
            console.error('Failed to update data', error);
            toast(error.message, { autoClose: false });
            showErrorMessage(error);
          },
        }
      );
    });
  };

  return {
    mutationCreateCatalog,
    handleCreateCatalog,
    mutationUpdateCatalog,
    handleUpdateUnbudget,
  };
};
