import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import { createPurchaseRequest, fetchPurchaseRequests } from './api';
import { PurchaseRequest, PurchaseRequestForm } from './entities';

export const useFetchPurchaseRequests = (
  params: PaginateParams
): UseQueryResult<Paginate<PurchaseRequest>, ResponseError> => {
  return useQuery(['purchase-requests', params], () =>
    fetchPurchaseRequests(params)
  );
};

export const useCreatePurchaseRequest = (): UseMutationResult<
  PurchaseRequest,
  ResponseError,
  PurchaseRequestForm
> => {
  return useMutation(createPurchaseRequest);
};
