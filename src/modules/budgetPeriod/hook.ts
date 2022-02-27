import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  deleteBudgetPeriods,
  fetchBudgetPeriod,
  fetchBudgetPeriodDetail,
} from './api';
import { BudgetPeriod } from './entities';

export const useFetchBudgetPeriod = (
  params: PaginateParams
): UseQueryResult<Paginate<BudgetPeriod>, ResponseError> => {
  return useQuery(['budget-period', params], () => fetchBudgetPeriod(params));
};

export const useDeleteBudgetPeriods = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idBudgetPeriods) => deleteBudgetPeriods(idBudgetPeriods));
};

export const useFetchBudgetPeriodDetail = (
  idBudgetPeriod: string
): UseQueryResult<BudgetPeriod> => {
  return useQuery(
    ['budget-period-detail', idBudgetPeriod],
    () => fetchBudgetPeriodDetail(idBudgetPeriod),
    { enabled: !!idBudgetPeriod }
  );
};
