import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchBudgetReferences } from './api';
import { BudgetReference } from './entities';

export const useFetchBudgetReferences = (
  params: PaginateParams
): UseQueryResult<Paginate<BudgetReference>, ResponseError> => {
  return useQuery(['budget-references', params], () =>
    fetchBudgetReferences(params)
  );
};
