import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import { createBudgetPlanItems } from './api';
import { BudgetPlanItem, CreateBudgetPlanItemsForm } from './entities';

export const useCreateBudgetPlanItems = (): UseMutationResult<
  BudgetPlanItem,
  ResponseError,
  CreateBudgetPlanItemsForm
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

// export const useDeleteBudgetPlan = (): UseMutationResult<
//   null,
//   ResponseError,
//   string[]
// > => {
//   return useMutation((idBudgetPlans) => deleteBudgetPlan(idBudgetPlans));
// };
