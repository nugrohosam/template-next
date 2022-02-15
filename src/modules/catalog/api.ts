import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { Catalog, CatalogForm } from './entities';

export const fetchCatalogs = async (
  params: PaginateParams
): Promise<Paginate<Catalog>> => {
  const result = await axios.get<ResponseData<Paginate<Catalog>>>(
    'v1/catalogs',
    { params }
  );
  return result.data.data;
};

export const createCatalog = async (data: CatalogForm): Promise<Catalog> => {
  const result = await axios.post<ResponseData<Catalog>>(`v1/catalogs`, data);
  return result.data.data;
};

export const fetchCatalogDetail = async (
  idCatalog: string
): Promise<Catalog> => {
  const result = await axios.get<ResponseData<Catalog>>(
    `v1/catalogs/${idCatalog}`
  );
  return result.data.data;
};

export const updateCatalog = async (
  idCatalog: string,
  data: CatalogForm
): Promise<Catalog> => {
  const result = await axios.put<ResponseData<Catalog>>(
    `v1/catalogs/${idCatalog}`,
    data
  );
  return result.data.data;
};

export const deleteCatalogs = async (idCatalogs: string[]): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>(`v1/catalogs`, {
    idCatalogs,
  });
  return result.data.data;
};
