import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  createAssetGroup,
  deleteAssetGroups,
  fetchAssetGroupDetail,
  fetchAsssetGroups,
  updateAssetGroup,
} from './api';
import { AssetGroup, AssetGroupForm } from './entities';

export const useFetchAssetGroups = (
  params: PaginateParams
): UseQueryResult<Paginate<AssetGroup>, ResponseError> => {
  return useQuery(['asset-groups', params], () => fetchAsssetGroups(params));
};

export const useFetchAssetGroupDetail = (
  idAssetGroup: string
): UseQueryResult<AssetGroup> => {
  return useQuery(
    ['asset-group-detail', idAssetGroup],
    () => fetchAssetGroupDetail(idAssetGroup),
    { enabled: !!idAssetGroup }
  );
};

export const useCreateAssetGroup = (): UseMutationResult<
  AssetGroup,
  ResponseError,
  AssetGroupForm
> => {
  return useMutation(createAssetGroup);
};

interface UpdateAssetGroupParams {
  idAssetGroup: string;
  data: AssetGroupForm;
}
export const useUpdateAssetGroup = (): UseMutationResult<
  AssetGroup,
  ResponseError,
  UpdateAssetGroupParams
> => {
  return useMutation(({ idAssetGroup, data }) =>
    updateAssetGroup(idAssetGroup, data)
  );
};

export const useDeleteAssetGroups = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idAssetGroups) => deleteAssetGroups(idAssetGroups));
};
