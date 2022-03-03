import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchAssetGroupSummary } from './api';
import { AssetGroupSummary } from './entities';

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
