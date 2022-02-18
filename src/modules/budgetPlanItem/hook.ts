import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import { createBudgetPlanItems, deleteBudgetPlanItems } from './api';
import { BudgetPlanItem, BudgetPlanItemForm } from './entities';

export const useCreateBudgetPlanItems = (): UseMutationResult<
  BudgetPlanItem,
  ResponseError,
  BudgetPlanItemForm
> => {
  return useMutation(createBudgetPlanItems);
};

// interface UpdateBudgetPlanParams {
//   idBudgetPlan: string;
//   data: BudgetPlanForm;
// }
// export const useUpdateBudgetPlan = (): UseMutationResult<
//   BudgetPlan,
//   ResponseError,
//   UpdateBudgetPlanParams
// > => {
//   return useMutation(({ idBudgetPlan, data }) =>
//     updateBudgetPlan(idBudgetPlan, data)
//   );
// };

export const useDeleteBudgetPlanitems = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idBudgetPlanItems) =>
    deleteBudgetPlanItems(idBudgetPlanItems)
  );
};
