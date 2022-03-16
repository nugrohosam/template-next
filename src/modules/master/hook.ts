import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import {
  fetchDeliveryPoints,
  fetchDepartments,
  fetchDistricts,
  fetchEmployees,
  fetchExpenseElements,
  FetchExpenseElementsParams,
  fetchMaterialGroups,
  fetchMnemonics,
  fetchSuppliers,
  fetchUom,
  fetchWarehouses,
} from './api';
import type {
  DeliveryPoint,
  Department,
  District,
  Employee,
  ExpenseElement,
  MaterialGroup,
  Mnemonic,
  Supplier,
  Uom,
  Warehouse,
} from './entities';

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

export const useFetchDeliveryPoints = (
  params: PaginateParams
): UseQueryResult<Paginate<DeliveryPoint>, ResponseError> => {
  return useQuery(['delivery-points', params], () =>
    fetchDeliveryPoints(params)
  );
};

export const useFetchWarehouses = (
  params: PaginateParams
): UseQueryResult<Paginate<Warehouse>, ResponseError> => {
  return useQuery(['warehouses', params], () => fetchWarehouses(params));
};

export const useFetchMaterialGroups = (
  params: PaginateParams
): UseQueryResult<Paginate<MaterialGroup>, ResponseError> => {
  return useQuery(['material-groups', params], () =>
    fetchMaterialGroups(params)
  );
};

export const useFetchUom = (
  params: PaginateParams
): UseQueryResult<Paginate<Uom>, ResponseError> => {
  return useQuery(['uom', params], () => fetchUom(params));
};

export const useFetchEmployees = (
  params: PaginateParams
): UseQueryResult<Paginate<Employee>, ResponseError> => {
  return useQuery(['employees', params], () => fetchEmployees(params));
};

export const useFetchSuppliers = (
  params: PaginateParams
): UseQueryResult<Paginate<Supplier>, ResponseError> => {
  return useQuery(['suppliers', params], () => fetchSuppliers(params));
};

export const useFetchMnemonics = (
  params: PaginateParams
): UseQueryResult<Paginate<Mnemonic>, ResponseError> => {
  return useQuery(['mnemonics', params], () => fetchMnemonics(params));
};
