import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';
import axiosEwgp from 'utils/axiosEwgp';
import axiosNfs from 'utils/axiosNfs';

import {
  DeliveryPoint,
  District,
  Employee,
  ExpenseElement,
  MaterialGroup,
  Mnemonic,
  Supplier,
  Uom,
  Warehouse,
} from './entities';

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
  const result = await axiosNfs.get<ResponseData<Paginate<District>>>(
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
  const result = await axiosNfs.get<ResponseData<Paginate<District>>>(
    `v1/departments`,
    {
      params,
    }
  );
  return result.data.data;
};

export const fetchDeliveryPoints = async (
  params: PaginateParams
): Promise<Paginate<DeliveryPoint>> => {
  const result = await axiosNfs.get<ResponseData<Paginate<DeliveryPoint>>>(
    'v1/e-budgeting/purchase-request/delivery-point',
    { params }
  );
  return result.data.data;
};

export const fetchWarehouses = async (
  params: PaginateParams
): Promise<Paginate<Warehouse>> => {
  const result = await axiosNfs.get<ResponseData<Paginate<Warehouse>>>(
    'v1/e-budgeting/purchase-request/warehouse',
    { params }
  );
  return result.data.data;
};

export const fetchMaterialGroups = async (
  params: PaginateParams
): Promise<Paginate<MaterialGroup>> => {
  const result = await axiosNfs.get<ResponseData<Paginate<MaterialGroup>>>(
    'v1/e-budgeting/purchase-request/material-group',
    { params }
  );
  return result.data.data;
};

export const fetchUom = async (
  params: PaginateParams
): Promise<Paginate<Uom>> => {
  const result = await axiosNfs.get<ResponseData<Paginate<Uom>>>(
    'v1/e-budgeting/purchase-request/uom-opex',
    { params }
  );
  return result.data.data;
};

export const fetchEmployees = async (
  params: PaginateParams
): Promise<Paginate<Employee>> => {
  const result = await axiosNfs.get<ResponseData<Paginate<Employee>>>(
    'v1/employess',
    { params }
  );
  return result.data.data;
};

export const fetchSuppliers = async (
  params: PaginateParams
): Promise<Paginate<Supplier>> => {
  const result = await axiosNfs.get<ResponseData<Paginate<Supplier>>>(
    'v1/suppliers',
    { params }
  );
  return result.data.data;
};

export const fetchMnemonics = async (
  params: PaginateParams
): Promise<Paginate<Mnemonic>> => {
  const result = await axiosNfs.get<ResponseData<Paginate<Mnemonic>>>(
    'v1/e-budgeting/purchase-request/mnemonic',
    { params }
  );
  return result.data.data;
};
