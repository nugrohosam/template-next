import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  approvalOverbudgets,
  createOverBudget,
  deleteOverBudget,
  DeleteOverBudgetParams,
  fetchOverBudgetDetail,
  fetchOverBudgets,
  submitOverbudgets,
  updateOverBudget,
} from './api';
import {
  ApprovalOverbudgets,
  OverBudget,
  OverBudgetDetail,
  OverBudgetForm,
  SubmitOverbudgets,
} from './entities';

export const useFetchOverBudgets = (
  params: PaginateParams
): UseQueryResult<Paginate<OverBudget>, ResponseError> => {
  return useQuery(['overbudgets', params], () => fetchOverBudgets(params));
};

export const useDeleteOverBudgets = (): UseMutationResult<
  null,
  ResponseError,
  DeleteOverBudgetParams
> => {
  return useMutation(({ idOverbudgets, action }) =>
    deleteOverBudget({ idOverbudgets, action })
  );
};

export const useFetchOverBudgetDetail = (
  idOverBudget: string
): UseQueryResult<OverBudgetDetail> => {
  return useQuery(
    ['overbudget-detail', idOverBudget],
    () => fetchOverBudgetDetail(idOverBudget),
    { enabled: !!idOverBudget }
  );
};

export const useCreateOverBudget = (): UseMutationResult<
  OverBudget,
  ResponseError,
  OverBudgetForm
> => {
  return useMutation(createOverBudget);
};

interface UpdateOverbudgetparams {
  idOverbudget: string;
  data: OverBudgetForm;
}

export const useUpdateOverbudget = (): UseMutationResult<
  OverBudget,
  ResponseError,
  UpdateOverbudgetparams
> => {
  return useMutation(({ idOverbudget, data }) =>
    updateOverBudget(idOverbudget, data)
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
  SubmitOverbudgets
> => {
  return useMutation((data) => submitOverbudgets(data));
};
