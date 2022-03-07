import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { OverBudget, OverBudgetDetail } from './entities';

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
