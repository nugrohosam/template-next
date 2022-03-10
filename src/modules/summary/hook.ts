import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import { fetchAssetGroupSummary, interveneSummaryAssetGroup } from './api';
import { AssetGroupSummary, InterveneField } from './entities';

export const useFetchAssetGroupSummary = (
  idAssetGroup: string,
  params: PaginateParams
): UseQueryResult<Paginate<AssetGroupSummary>, ResponseError> => {
  return useQuery(
    ['asset-group-summary', idAssetGroup, params],
    () => fetchAssetGroupSummary(idAssetGroup, params),
    { enabled: !!idAssetGroup }
  );
};

interface InterveneAssetGroupParams {
  idAssetGroup: string;
  data: InterveneField;
}

export const useInterveneSummaryAssetGroup = (): UseMutationResult<
  InterveneField,
  ResponseError,
  InterveneAssetGroupParams
> => {
  return useMutation(({ idAssetGroup, data }) =>
    interveneSummaryAssetGroup(idAssetGroup, data)
  );
};
