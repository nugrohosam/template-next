import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { OverBudget, OverBudgetDetail, OverBudgetForm } from './entities';

export const fetchOverBudgets = async (
  params: PaginateParams
): Promise<Paginate<OverBudget>> => {
  const result = await axios.get<ResponseData<Paginate<OverBudget>>>(
    'v1/overbudgets',
    { params }
  );
  return result.data.data;
};

export interface DeleteOverBudgetParams {
  idOverbudgets: string[];
  action: string;
}

export const deleteOverBudget = async (
  deleteParams: DeleteOverBudgetParams
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>(
    'v1/overbudgets',
    deleteParams
  );
  return result.data.data;
};

export const fetchOverBudgetDetail = async (
  idOverBudget: string
): Promise<OverBudgetDetail> => {
  const result = await axios.get<ResponseData<OverBudgetDetail>>(
    `v1/overbudgets/${idOverBudget}`
  );
  return result.data.data;
};

export const createOverBudget = async (
  data: OverBudgetForm
): Promise<OverBudget> => {
  const result = await axios.post<ResponseData<OverBudget>>(
    'v1/overbudgets',
    data
  );
  return result.data.data;
};

export const updateOverBudget = async (
  idOverbudget: string,
  data: OverBudgetForm
): Promise<OverBudget> => {
  const result = await axios.put<ResponseData<OverBudget>>(
    `v1/overbudgets/${idOverbudget}`,
    data
  );
  return result.data.data;
};
