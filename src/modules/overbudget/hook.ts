import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  deleteOverBudget,
  DeleteOverBudgetParams,
  fetchOverBudgets,
} from './api';
import { OverBudget } from './entities';

export const useFetchOverBudgets = (
  params: PaginateParams
): UseQueryResult<Paginate<OverBudget>, ResponseError> => {
  return useQuery(['overbudgets', params], () => fetchOverBudgets(params));
};

export const useDeleteOverBudgets = (): UseMutationResult<
  null,
  ResponseError,
  DeleteOverBudgetParams
> => {
  return useMutation(({ idOverbudgets, action }) =>
    deleteOverBudget({ idOverbudgets, action })
  );
};
