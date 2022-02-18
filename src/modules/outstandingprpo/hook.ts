import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import { confirmOutstandingPrPo, fetchOutstandingPrPo } from './api';
import { OutstandingPrPo, OutstandingPrPoConfirmation } from './entities';

export const useFetchOutstandingPrPo = (
  params: PaginateParams
): UseQueryResult<Paginate<OutstandingPrPo>, ResponseError> => {
  return useQuery(['catalogs', params], () => fetchOutstandingPrPo(params));
};

export const useConfirmOutstandingPrPo = (): UseMutationResult<
  OutstandingPrPo,
  ResponseError,
  OutstandingPrPoConfirmation
> => {
  return useMutation((data) => confirmOutstandingPrPo(data));
};
