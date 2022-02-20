import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  createBudgetPlanItems,
  deleteBudgetPlanItems,
  updateBudgetPlanItems,
} from './api';
import { BudgetPlanItem, BudgetPlanItemForm } from './entities';

export const useCreateBudgetPlanItems = (): UseMutationResult<
  BudgetPlanItem,
  ResponseError,
  BudgetPlanItemForm
> => {
  return useMutation(createBudgetPlanItems);
};

export const useUpdateBudgetPlanItems = (): UseMutationResult<
  BudgetPlanItem,
  ResponseError,
  BudgetPlanItemForm
> => {
  return useMutation(updateBudgetPlanItems);
};

export const useDeleteBudgetPlanitems = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idBudgetPlanItems) =>
    deleteBudgetPlanItems(idBudgetPlanItems)
  );
};
