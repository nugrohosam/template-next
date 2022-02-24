import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { BudgetReference } from './entities';

export const fetchBudgetReferences = async (
  params: PaginateParams
): Promise<Paginate<BudgetReference>> => {
  const result = await axios.get<ResponseData<Paginate<BudgetReference>>>(
    'v1/budgetreferences',
    { params }
  );
  return result.data.data;
};
