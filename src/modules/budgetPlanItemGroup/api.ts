import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { BudgetPlanItemGroup, BudgetPlanItemGroupItem } from './entities';

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

export const fetchBudgetPlanItemGroupItems = async (
  idBudgetPlanItemGroup: string,
  params: PaginateParams
): Promise<Paginate<BudgetPlanItemGroupItem>> => {
  const result = await axios.get<
    ResponseData<Paginate<BudgetPlanItemGroupItem>>
  >(`v1/budgetplanitemgroups/${idBudgetPlanItemGroup}/items`, { params });
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

export const submitBudgetPlanItemGroups = async (
  idBudgetPlanItemGroups: string[]
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>(
    'v1/budgetplanitemgroups/submit',
    {
      idBudgetPlanItemGroups,
    }
  );
  return result.data.data;
};
