import { BudgetPlanItemGroup } from 'modules/budgetPlanItemGroup/entities';
import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

export const fetchPendingTaskBudgetPlanItemGroups = async (
  params: PaginateParams
): Promise<Paginate<BudgetPlanItemGroup>> => {
  const result = await axios.get<ResponseData<Paginate<BudgetPlanItemGroup>>>(
    'v1/budgetplanitemgroups',
    { params }
  );
  return result.data.data;
};
