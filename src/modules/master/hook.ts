import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import {
  fetchDepartments,
  fetchDistricts,
  fetchExpenseElements,
  FetchExpenseElementsParams,
} from './api';
import type { Department, District, ExpenseElement } from './entities';

export const useFetchExpenseElements = (
  params: FetchExpenseElementsParams
): UseQueryResult<Paginate<ExpenseElement>, ResponseError> => {
  return useQuery(
    ['expense-elements', params],
    () => fetchExpenseElements(params),
    {
      enabled: !!params.districtCode,
    }
  );
};

export const useFetchDistricts = (
  params: PaginateParams
): UseQueryResult<Paginate<District>, ResponseError> => {
  return useQuery(['districts', params], () => fetchDistricts(params));
};

export const useFetchDepartments = (
  params: PaginateParams
): UseQueryResult<Paginate<Department>, ResponseError> => {
  return useQuery(['departments', params], () => fetchDepartments(params));
};
