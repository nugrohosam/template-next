import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { District, ExpenseElement } from './entities';

export interface FetchExpenseElementsParams {
  districtCode: string | undefined;
}

export const fetchExpenseElements = async (
  params: FetchExpenseElementsParams
): Promise<Paginate<ExpenseElement>> => {
  const result = await axios.get<ResponseData<Paginate<ExpenseElement>>>(
    `v1/expenseelement`,
    { params }
  );
  return result.data.data;
};

export const fetchDistricts = async (
  params: PaginateParams
): Promise<Paginate<District>> => {
  const result = await axios.get<ResponseData<Paginate<District>>>(
    `v1/districts`,
    {
      params,
    }
  );
  return result.data.data;
};

export const fetchDepartments = async (
  params: PaginateParams
): Promise<Paginate<District>> => {
  const result = await axios.get<ResponseData<Paginate<District>>>(
    `v1/departments`,
    {
      params,
    }
  );
  return result.data.data;
};
