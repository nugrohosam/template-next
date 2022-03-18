import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  createPurchaseRequest,
  fetchPurchaseRequestDetail,
  fetchPurchaseRequests,
  updatePurchaseRequest,
} from './api';
import {
  PurchaseRequest,
  PurchaseRequestDetail,
  PurchaseRequestForm,
} from './entities';

export const useFetchPurchaseRequests = (
  params: PaginateParams
): UseQueryResult<Paginate<PurchaseRequest>, ResponseError> => {
  return useQuery(['purchase-requests', params], () =>
    fetchPurchaseRequests(params)
  );
};

export const useFetchPurchaseRequestDetail = (
  idPurchaseRequest: string
): UseQueryResult<PurchaseRequestDetail> => {
  return useQuery(
    ['purchase-request-details', idPurchaseRequest],
    () => fetchPurchaseRequestDetail(idPurchaseRequest),
    { enabled: !!idPurchaseRequest }
  );
};

export const useCreatePurchaseRequest = (): UseMutationResult<
  PurchaseRequest,
  ResponseError,
  PurchaseRequestForm
> => {
  return useMutation(createPurchaseRequest);
};

export interface UpdatePurchaseRequestparams {
  idPurchaseRequest: string;
  data: PurchaseRequestForm;
}

export const useUpdatePurchaseRequest = (): UseMutationResult<
  PurchaseRequest,
  ResponseError,
  UpdatePurchaseRequestparams
> => {
  return useMutation(({ idPurchaseRequest, data }) =>
    updatePurchaseRequest(idPurchaseRequest, data)
  );
};
