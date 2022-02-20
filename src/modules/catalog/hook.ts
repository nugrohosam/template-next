import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  createCatalog,
  deleteCatalogs,
  fetchCatalogDetail,
  fetchCatalogs,
  updateCatalog,
} from './api';
import { Catalog, CatalogForm } from './entities';

interface FetchCatalogParams extends PaginateParams {
  assetGroupId?: string;
}
export const useFetchCatalogs = (
  params: FetchCatalogParams
): UseQueryResult<Paginate<Catalog>, ResponseError> => {
  return useQuery(['catalogs', params], () => fetchCatalogs(params));
};

export const useCreateCatalog = (): UseMutationResult<
  Catalog,
  ResponseError,
  CatalogForm
> => {
  return useMutation(createCatalog);
};

export const useFetchCatalogDetail = (
  idCatalog: string
): UseQueryResult<Catalog> => {
  return useQuery(
    ['catalog-detail', idCatalog],
    () => fetchCatalogDetail(idCatalog),
    { enabled: !!idCatalog }
  );
};

interface UpdateCatalogParams {
  idCatalog: string;
  data: CatalogForm;
}

export const useUpdateCatalog = (): UseMutationResult<
  Catalog,
  ResponseError,
  UpdateCatalogParams
> => {
  return useMutation(({ idCatalog, data }) => updateCatalog(idCatalog, data));
};

export const useDeleteCatalogs = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idCatalogs) => deleteCatalogs(idCatalogs));
};
