import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  approvalOverbudgets,
  createOverbudget,
  deleteOverbudget,
  DeleteOverbudgetParams,
  fetchOverbudgetDetail,
  fetchOverbudgets,
  submitOverbudgets,
  updateOverbudget,
} from './api';
import {
  ApprovalOverbudgets,
  Overbudget,
  OverbudgetDetail,
  OverbudgetForm,
} from './entities';

export const useFetchOverbudgets = (
  params: PaginateParams
): UseQueryResult<Paginate<Overbudget>, ResponseError> => {
  return useQuery(['overbudgets', params], () => fetchOverbudgets(params));
};

export const useDeleteOverbudgets = (): UseMutationResult<
  null,
  ResponseError,
  DeleteOverbudgetParams
> => {
  return useMutation(({ idOverbudgets, action }) =>
    deleteOverbudget({ idOverbudgets, action })
  );
};

export const useFetchOverbudgetDetail = (
  idOverbudget: string
): UseQueryResult<OverbudgetDetail> => {
  return useQuery(
    ['overbudget-detail', idOverbudget],
    () => fetchOverbudgetDetail(idOverbudget),
    { enabled: !!idOverbudget }
  );
};

export const useCreateOverbudget = (): UseMutationResult<
  Overbudget,
  ResponseError,
  OverbudgetForm
> => {
  return useMutation(createOverbudget);
};

interface UpdateOverbudgetparams {
  idOverbudget: string;
  data: OverbudgetForm;
}

export const useUpdateOverbudget = (): UseMutationResult<
  Overbudget,
  ResponseError,
  UpdateOverbudgetparams
> => {
  return useMutation(({ idOverbudget, data }) =>
    updateOverbudget(idOverbudget, data)
  );
};

export const useApprovalOverbudgets = (): UseMutationResult<
  null,
  ResponseError,
  ApprovalOverbudgets
> => {
  return useMutation((data) => approvalOverbudgets(data));
};

export const useSubmitOverbudgets = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((data) => submitOverbudgets(data));
};
