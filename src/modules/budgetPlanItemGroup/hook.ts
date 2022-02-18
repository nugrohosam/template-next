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
  fetchBudgetPlanItemGroupItems,
  fetchBudgetPlanItemGroups,
} from './api';
import { BudgetPlanItemGroup, BudgetPlanItemGroupItem } from './entities';

export const useFetchBudgetPlanItemGroups = (
  params: PaginateParams
): UseQueryResult<Paginate<BudgetPlanItemGroup>, ResponseError> => {
  return useQuery(['budget-plan-item-groups', params], () =>
    fetchBudgetPlanItemGroups(params)
  );
};

export const useFetchBudgetPlanItemGroupDetail = (
  idBudgetPlanItemGroup: string
): UseQueryResult<BudgetPlanItemGroup> => {
  return useQuery(
    ['budget-plan-item-group-detail', idBudgetPlanItemGroup],
    () => fetchBudgetPlanItemGroupDetail(idBudgetPlanItemGroup),
    { enabled: !!idBudgetPlanItemGroup }
  );
};

export const useFetchBudgetPlanItemGroupItems = (
  idBudgetPlanItemGroup: string,
  params: PaginateParams
): UseQueryResult<Paginate<BudgetPlanItemGroupItem>, ResponseError> => {
  return useQuery(
    ['budget-plan-item-group-items', idBudgetPlanItemGroup, params],
    () => fetchBudgetPlanItemGroupItems(idBudgetPlanItemGroup, params)
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
