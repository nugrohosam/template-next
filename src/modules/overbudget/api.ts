import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import {
  ApprovalOverbudgets,
  Overbudget,
  OverbudgetDetail,
  OverbudgetForm,
} from './entities';

export const fetchOverbudgets = async (
  params: PaginateParams
): Promise<Paginate<Overbudget>> => {
  const result = await axios.get<ResponseData<Paginate<Overbudget>>>(
    'v1/overbudgets',
    { params }
  );
  return result.data.data;
};

export interface DeleteOverbudgetParams {
  idOverbudgets: string[];
  action: string;
}

export const deleteOverbudget = async (
  deleteParams: DeleteOverbudgetParams
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>(
    'v1/overbudgets',
    deleteParams
  );
  return result.data.data;
};

export const fetchOverbudgetDetail = async (
  idOverbudget: string
): Promise<OverbudgetDetail> => {
  const result = await axios.get<ResponseData<OverbudgetDetail>>(
    `v1/overbudgets/${idOverbudget}`
  );
  return result.data.data;
};

export const createOverbudget = async (
  data: OverbudgetForm
): Promise<Overbudget> => {
  const result = await axios.post<ResponseData<Overbudget>>(
    'v1/overbudgets',
    data
  );
  return result.data.data;
};

export const updateOverbudget = async (
  idOverbudget: string,
  data: OverbudgetForm
): Promise<Overbudget> => {
  const result = await axios.put<ResponseData<Overbudget>>(
    `v1/overbudgets/${idOverbudget}`,
    data
  );
  return result.data.data;
};

export const approvalOverbudgets = async (
  data: ApprovalOverbudgets
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>(
    'v1/overbudgets/approval',
    data
  );
  return result.data.data;
};

export const submitOverbudgets = async (
  idOverbudgets: string[]
): Promise<null> => {
  const result = await axios.patch<ResponseData<null>>(
    'v1/overbudgets/submit',
    { idOverbudgets }
  );
  return result.data.data;
};
