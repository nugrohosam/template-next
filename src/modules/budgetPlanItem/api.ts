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

export const updateBudgetPlanItems = async (
  data: BudgetPlanItemForm
): Promise<BudgetPlanItem> => {
  const result = await axios.put<ResponseData<BudgetPlanItem>>(
    `v1/budgetplanitems`,
    data
  );
  return result.data.data;
};

export const deleteBudgetPlanItems = async (
  idBudgetPlanItems: string[]
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>('v1/budgetplanitems', {
    idBudgetPlanItems,
  });
  return result.data.data;
};
