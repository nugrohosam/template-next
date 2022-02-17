import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { BudgetPlanItem, BudgetPlanItemForm } from './entities';

export const createBudgetPlanItems = async (
  data: BudgetPlanItemForm
): Promise<BudgetPlanItem> => {
  const result = await axios.post<ResponseData<BudgetPlanItem>>(
    'v1/budgetplanitems',
    data
  );
  return result.data.data;
};

// export const updateBudgetPlan = async (
//   idBudgetPlan: string,
//   data: BudgetPlanForm
// ): Promise<BudgetPlan> => {
//   const result = await axios.put<ResponseData<BudgetPlan>>(
//     `v1/budgetplan/${idBudgetPlan}`,
//     data
//   );
//   return result.data.data;
// };

// export const deleteBudgetPlan = async (
//   idBudgetPlans: string[]
// ): Promise<null> => {
//   const result = await axios.patch<ResponseData<null>>('v1/budgetplan', {
//     idBudgetPlans,
//   });
//   return result.data.data;
// };
