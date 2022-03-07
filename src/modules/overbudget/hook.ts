import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  createOverBudget,
  deleteOverBudget,
  DeleteOverBudgetParams,
  fetchOverBudgetDetail,
  fetchOverBudgets,
} from './api';
import { OverBudget, OverBudgetDetail, OverBudgetForm } from './entities';

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

export const useFetchOverBudgetDetail = (
  idOverBudget: string
): UseQueryResult<OverBudgetDetail> => {
  return useQuery(
    ['overbudget-detail', idOverBudget],
    () => fetchOverBudgetDetail(idOverBudget),
    { enabled: !!idOverBudget }
  );
};

export const useCreateOverBudget = (): UseMutationResult<
  OverBudget,
  ResponseError,
  OverBudgetForm
> => {
  return useMutation(createOverBudget);
};
