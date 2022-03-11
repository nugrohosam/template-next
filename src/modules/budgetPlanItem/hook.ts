import { ResponseError } from 'modules/common/types';
import { useMutation, UseMutationResult } from 'react-query';

import {
  createBudgetPlanItem,
  deleteBudgetPlanItems,
  updateBudgetPlanItem,
  uploadBudgetPlanItems,
} from './api';
import { BudgetPlanItem, BudgetPlanItemForm } from './entities';

export const useCreateBudgetPlanItem = (): UseMutationResult<
  BudgetPlanItem,
  ResponseError,
  BudgetPlanItemForm
> => {
  return useMutation(createBudgetPlanItem);
};

export const useUpdateBudgetPlanItem = (): UseMutationResult<
  BudgetPlanItem,
  ResponseError,
  BudgetPlanItemForm
> => {
  return useMutation(updateBudgetPlanItem);
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

export const useUploadBudgetPlanItems = (): UseMutationResult<
  null,
  ResponseError,
  FormData
> => {
  return useMutation(uploadBudgetPlanItems);
};
