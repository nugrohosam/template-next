import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { BudgetPlanItemGroup } from './entities';

export const fetchBudgetPlanItemGroups = async (
  params: PaginateParams
): Promise<Paginate<BudgetPlanItemGroup>> => {
  const result = await axios.get<ResponseData<Paginate<BudgetPlanItemGroup>>>(
    'v1/budgetplanitemgroups',
    { params }
  );
  return result.data.data;
};

export const fetchBudgetPlanItemGroupDetail = async (
  idBudgetPlanItemGroup: string
): Promise<BudgetPlanItemGroup> => {
  const result = await axios.get<ResponseData<BudgetPlanItemGroup>>(
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
