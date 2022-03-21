import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { PendingTask } from './entities';

export const fetchPendingTaskBudgetPlanItemGroups = async (
  params: PaginateParams
): Promise<Paginate<PendingTask>> => {
  const result = await axios.get<ResponseData<Paginate<PendingTask>>>(
    'v1/budgetplanitemgroups',
    { params }
  );
  return result.data.data;
};
