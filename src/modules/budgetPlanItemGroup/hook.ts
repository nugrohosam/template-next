import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  deleteBudgetPlanItemGroups,
  fetchBudgetPlanItemGroupDetail,
  fetchBudgetPlanItemGroups,
} from './api';
import { BudgetPlanItemGorup } from './entities';

export const useFetchBudgetPlanItemGroups = (
  params: PaginateParams
): UseQueryResult<Paginate<BudgetPlanItemGorup>, ResponseError> => {
  return useQuery(['budget-plan-item-group', params], () =>
    fetchBudgetPlanItemGroups(params)
  );
};

export const useFetchBudgetPlanItemGroupDetail = (
  idBudgetPlanItemGroup: string
): UseQueryResult<BudgetPlanItemGorup> => {
  return useQuery(
    ['budget-plan-item-group-detail', idBudgetPlanItemGroup],
    () => fetchBudgetPlanItemGroupDetail(idBudgetPlanItemGroup),
    { enabled: !!idBudgetPlanItemGroup }
  );
};

export const useDeleteBudgetPlanItemGroups = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idBudgetPlanItemGroups) =>
    deleteBudgetPlanItemGroups(idBudgetPlanItemGroups)
  );
};
