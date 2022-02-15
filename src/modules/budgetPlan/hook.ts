import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  createBudgetPlan,
  deleteBudgetPlan,
  fetchBudgetPlan,
  fetchBudgetPlanDetail,
  updateBudgetPlan,
} from './api';
import { BudgetPlan, BudgetPlanForm } from './entities';

export const useFetchBudgetPlan = (
  params: PaginateParams
): UseQueryResult<Paginate<BudgetPlan>, ResponseError> => {
  return useQuery(['budget-plan', params], () => fetchBudgetPlan(params));
};

export const useFetchBudgetPlanDetail = (
  idBudgetPlan: string
): UseQueryResult<BudgetPlan> => {
  return useQuery(
    ['budget-plan-detail', idBudgetPlan],
    () => fetchBudgetPlanDetail(idBudgetPlan),
    { enabled: !!idBudgetPlan }
  );
};

export const useCreateBudgetPlan = (): UseMutationResult<
  BudgetPlan,
  ResponseError,
  BudgetPlanForm
> => {
  return useMutation(createBudgetPlan);
};

interface UpdateBudgetPlanParams {
  idBudgetPlan: string;
  data: BudgetPlanForm;
}
export const useUpdateBudgetPlan = (): UseMutationResult<
  BudgetPlan,
  ResponseError,
  UpdateBudgetPlanParams
> => {
  return useMutation(({ idBudgetPlan, data }) =>
    updateBudgetPlan(idBudgetPlan, data)
  );
};

export const useDeleteBudgetPlan = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idBudgetPlans) => deleteBudgetPlan(idBudgetPlans));
};
