import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { OutstandingPrPo, OutstandingPrPoConfirmation } from './entities';

export const fetchOutstandingPrPo = async (
  params: PaginateParams
): Promise<Paginate<OutstandingPrPo>> => {
  const result = await axios.get<ResponseData<Paginate<OutstandingPrPo>>>(
    'v1/outstandingprpo',
    { params }
  );
  return result.data.data;
};

export const confirmOutstandingPrPo = async (
  data: OutstandingPrPoConfirmation
): Promise<OutstandingPrPo> => {
  const result = await axios.put<ResponseData<OutstandingPrPo>>(
    'v1/outstandingprpo/confirm',
    data
  );
  return result.data.data;
};
