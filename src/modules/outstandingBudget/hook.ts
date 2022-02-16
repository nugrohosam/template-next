import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import { confirmationOutstandingBudget, fetchOutstandingBudget } from './api';
import { confirmOutstandingBudget, outstandingBudget } from './entities';

export const useFetchOutstandingBudget = (
  params: PaginateParams
): UseQueryResult<Paginate<outstandingBudget>, ResponseError> => {
  return useQuery(['outstanding-budget', params], () =>
    fetchOutstandingBudget(params)
  );
};

export const useConfirmationOutstandingBudget = (): UseMutationResult<
  outstandingBudget,
  ResponseError,
  confirmOutstandingBudget
> => {
  return useMutation(confirmationOutstandingBudget);
};
