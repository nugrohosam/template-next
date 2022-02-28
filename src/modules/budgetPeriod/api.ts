import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { BudgetPeriod, BudgetPeriodForm } from './entities';

export const fetchBudgetPeriod = async (
  params: PaginateParams
): Promise<Paginate<BudgetPeriod>> => {
  const result = await axios.get<ResponseData<Paginate<BudgetPeriod>>>(
    'v1/budgetperiods',
    { params }
  );
  return result.data.data;
};

export const deleteBudgetPeriods = async (
  idBudgetPeriods: string[]
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>('v1/budgetperiods', {
    idBudgetPeriods,
  });
  return result.data.data;
};

export const fetchBudgetPeriodDetail = async (
  idBudgetPeriod: string
): Promise<BudgetPeriod> => {
  const result = await axios.get<ResponseData<BudgetPeriod>>(
    `v1/budgetperiods/${idBudgetPeriod}`
  );
  return result.data.data;
};

export const createBudgetPeriod = async (
  data: BudgetPeriodForm
): Promise<BudgetPeriod> => {
  const result = await axios.post<ResponseData<BudgetPeriod>>(
    'v1/budgetperiods',
    data
  );
  return result.data.data;
};

export const updateBudgetPeriod = async (
  idBudgetPeriod: string,
  data: BudgetPeriodForm
): Promise<BudgetPeriod> => {
  const result = await axios.put<ResponseData<BudgetPeriod>>(
    `v1/budgetperiods/${idBudgetPeriod}`,
    data
  );
  return result.data.data;
};
