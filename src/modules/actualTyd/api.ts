import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { ActualYtd } from './entities';

export const fetchActualYtd = async (
  params: PaginateParams
): Promise<Paginate<ActualYtd>> => {
  const result = await axios.get<ResponseData<Paginate<ActualYtd>>>(
    'v1/actualytd',
    { params }
  );
  return result.data.data;
};
