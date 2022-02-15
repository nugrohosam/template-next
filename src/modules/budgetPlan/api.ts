import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { BudgetPlan, BudgetPlanForm } from './entities';

export const fetchBudgetPlan = async (
  params: PaginateParams
): Promise<Paginate<BudgetPlan>> => {
  const result = await axios.get<ResponseData<Paginate<BudgetPlan>>>(
    'v1/budgetplan',
    { params }
  );
  return result.data.data;
};

export const fetchBudgetPlanDetail = async (
  idBudgetPlan: string
): Promise<BudgetPlan> => {
  const result = await axios.get<ResponseData<BudgetPlan>>(
    `v1/budgetplan/${idBudgetPlan}`
  );
  return result.data.data;
};

export const createBudgetPlan = async (
  data: BudgetPlanForm
): Promise<BudgetPlan> => {
  const result = await axios.post<ResponseData<BudgetPlan>>(
    'v1/budgetplan',
    data
  );
  return result.data.data;
};

export const updateBudgetPlan = async (
  idBudgetPlan: string,
  data: BudgetPlanForm
): Promise<BudgetPlan> => {
  const result = await axios.put<ResponseData<BudgetPlan>>(
    `v1/budgetplan/${idBudgetPlan}`,
    data
  );
  return result.data.data;
};

export const deleteBudgetPlan = async (
  idBudgetPlans: string[]
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>('v1/budgetplan', {
    idBudgetPlans,
  });
  return result.data.data;
};
