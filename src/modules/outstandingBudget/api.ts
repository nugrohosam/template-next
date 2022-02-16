import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { confirmOutstandingBudget, outstandingBudget } from './entities';

export const fetchOutstandingBudget = async (
  params: PaginateParams
): Promise<Paginate<outstandingBudget>> => {
  const result = await axios.get<ResponseData<Paginate<outstandingBudget>>>(
    'v1/outstandingbudgets',
    { params }
  );
  return result.data.data;
};

export const confirmationOutstandingBudget = async (
  data: confirmOutstandingBudget
): Promise<outstandingBudget> => {
  const result = await axios.put<ResponseData<outstandingBudget>>(
    'v1/outstandingbudgets/confirm',
    data
  );
  return result.data.data;
};
