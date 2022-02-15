import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { BudgetPlanItemGorup } from './entities';

export const fetchBudgetPlanItemGroups = async (
  params: PaginateParams
): Promise<Paginate<BudgetPlanItemGorup>> => {
  const result = await axios.get<ResponseData<Paginate<BudgetPlanItemGorup>>>(
    'v1/budgetplanitemgroups',
    { params }
  );
  return result.data.data;
};

export const fetchBudgetPlanItemGroupDetail = async (
  idBudgetPlanItemGroup: string
): Promise<BudgetPlanItemGorup> => {
  const result = await axios.get<ResponseData<BudgetPlanItemGorup>>(
    `v1/budgetplanitemgroups/${idBudgetPlanItemGroup}`
  );
  return result.data.data;
};

export const deleteBudgetPlanItemGroups = async (
  idBudgetPlanItemGroups: string[]
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>(
    'v1/budgetplanitemgroups/cancel',
    {
      idBudgetPlanItemGroups,
    }
  );
  return result.data.data;
};
