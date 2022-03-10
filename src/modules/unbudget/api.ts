import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import {
  ApprovalUnbudgetForm,
  Unbudget,
  UnbudgetDetail,
  UnbudgetForm,
  UnbudgetItem,
} from './entities';

export const fetchUnbudgets = async (
  params: PaginateParams
): Promise<Paginate<Unbudget>> => {
  const result = await axios.get<ResponseData<Paginate<Unbudget>>>(
    'v1/unbudgets',
    { params }
  );
  return result.data.data;
};

export const fetchUnbudgetDetail = async (
  idUnbudget: string
): Promise<UnbudgetDetail> => {
  const result = await axios.get<ResponseData<UnbudgetDetail>>(
    `v1/unbudgets/${idUnbudget}`
  );
  return result.data.data;
};

export const fetchUnbudgetItems = async (
  idUnbudget: string,
  params: PaginateParams
): Promise<Paginate<UnbudgetItem>> => {
  const result = await axios.get<ResponseData<Paginate<UnbudgetItem>>>(
    `v1/unbudgets/${idUnbudget}/items`,
    { params }
  );
  return result.data.data;
};

export const createUnbudget = async (
  data: UnbudgetForm
): Promise<UnbudgetDetail> => {
  const result = await axios.post<ResponseData<UnbudgetDetail>>(
    'v1/unbudgets',
    data
  );
  return result.data.data;
};

export const updateUnbudget = async (
  idUnbudget: string,
  data: UnbudgetForm
): Promise<UnbudgetDetail> => {
  const result = await axios.put<ResponseData<UnbudgetDetail>>(
    `v1/unbudgets/${idUnbudget}`,
    data
  );
  return result.data.data;
};

export const deleteUnbudgets = async (idUnbudgets: string[]): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>('v1/unbudgets/delete', {
    idUnbudgets,
  });
  return result.data.data;
};

export const submitUnbudgets = async (idUnbudgets: string[]): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>('v1/unbudgets/submit', {
    idUnbudgets,
  });
  return result.data.data;
};

export const cancelUnbudgets = async (idUnbudgets: string[]): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>('v1/unbudgets/cancel', {
    idUnbudgets,
  });
  return result.data.data;
};

export const approvalUnbudgets = async (
  data: ApprovalUnbudgetForm
): Promise<null> => {
  const result = await axios.put<ResponseData<null>>(
    'v1/unbudgets/approval',
    data
  );
  return result.data.data;
};
