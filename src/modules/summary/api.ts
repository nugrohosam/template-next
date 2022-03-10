import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { AssetGroupSummary, InterveneField } from './entities';

export const fetchAssetGroupSummary = async (
  idAssetGroup: string,
  params: PaginateParams
): Promise<Paginate<AssetGroupSummary>> => {
  const result = await axios.get<ResponseData<Paginate<AssetGroupSummary>>>(
    `v1/summaries/${idAssetGroup}`,
    { params }
  );
  return result.data.data;
};

export const interveneSummaryAssetGroup = async (
  idAssetGroup: string,
  data: InterveneField
): Promise<InterveneField> => {
  const result = await axios.post<ResponseData<InterveneField>>(
    `v1/summaries/${idAssetGroup}/intervene`,
    data
  );
  return result.data.data;
};
