import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { PurchaseRequest } from './entities';

export const fetchPurchaseRequests = async (
  params: PaginateParams
): Promise<Paginate<PurchaseRequest>> => {
  const result = await axios.get<ResponseData<Paginate<PurchaseRequest>>>(
    'v1/purchaserequests',
    { params }
  );
  return result.data.data;
};
