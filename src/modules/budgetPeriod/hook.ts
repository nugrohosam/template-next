import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  createBudgetPeriod,
  deleteBudgetPeriods,
  fetchBudgetPeriod,
  fetchBudgetPeriodDetail,
  updateBudgetPeriod,
} from './api';
import { BudgetPeriod, BudgetPeriodForm } from './entities';

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

export const useCreateBudgetPeriod = (): UseMutationResult<
  BudgetPeriod,
  ResponseError,
  BudgetPeriodForm
> => {
  return useMutation(createBudgetPeriod);
};

interface UpdateBudgetPeriodParams {
  idBudgetPeriod: string;
  data: BudgetPeriodForm;
}

export const useUpdateBudgetPeriod = (): UseMutationResult<
  BudgetPeriod,
  ResponseError,
  UpdateBudgetPeriodParams
> => {
  return useMutation(({ idBudgetPeriod, data }) =>
    updateBudgetPeriod(idBudgetPeriod, data)
  );
};
