import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { AssetGroupSummary } from './entities';

// TODO: data masih pakai paginate (API dummy), tunggu update design API tanpa paginate
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
