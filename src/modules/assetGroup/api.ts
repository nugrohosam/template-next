import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { AssetGroup, AssetGroupForm } from './entities';

export const fetchAsssetGroups = async (
  params: PaginateParams
): Promise<Paginate<AssetGroup>> => {
  const result = await axios.get<ResponseData<Paginate<AssetGroup>>>(
    'v1/assetgroups',
    { params }
  );
  return result.data.data;
};

export const fetchAssetGroupDetail = async (
  idAssetGroups: string
): Promise<AssetGroup> => {
  const result = await axios.get<ResponseData<AssetGroup>>(
    `v1/assetgroups/${idAssetGroups}`
  );
  return result.data.data;
};

export const createAssetGroup = async (
  data: AssetGroupForm
): Promise<AssetGroup> => {
  const result = await axios.post<ResponseData<AssetGroup>>(
    'v1/assetgroups',
    data
  );
  return result.data.data;
};

export const updateAssetGroup = async (
  idAssetGroup: string,
  data: AssetGroupForm
): Promise<AssetGroup> => {
  const result = await axios.put<ResponseData<AssetGroup>>(
    `v1/assetgroups/${idAssetGroup}`,
    data
  );
  return result.data.data;
};

export const deleteAssetGroups = async (
  idAssetGroups: string[]
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>('v1/assetgroups', {
    idAssetGroups,
  });
  return result.data.data;
};
