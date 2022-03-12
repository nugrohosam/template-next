import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchPurchaseRequests } from './api';
import { PurchaseRequest } from './entities';

export const useFetchPurchaseRequests = (
  params: PaginateParams
): UseQueryResult<Paginate<PurchaseRequest>, ResponseError> => {
  return useQuery(['purchase-requests', params], () =>
    fetchPurchaseRequests(params)
  );
};
