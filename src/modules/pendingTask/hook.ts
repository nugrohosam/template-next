import { BudgetPlanItemGroup } from 'modules/budgetPlanItemGroup/entities';
import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchPendingTaskBudgetPlanItemGroups } from './api';

export interface PendingTaskBudgetPlanItemGroupsParams extends PaginateParams {
  status: string;
}

export const useFetchPendingTaskBudgetPlanItemGroups = (
  params: PendingTaskBudgetPlanItemGroupsParams
): UseQueryResult<Paginate<BudgetPlanItemGroup>, ResponseError> => {
  return useQuery(['pending-task-budget-plan-item-groups', params], () =>
    fetchPendingTaskBudgetPlanItemGroups(params)
  );
};
