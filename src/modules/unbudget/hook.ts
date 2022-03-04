import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import {
  deleteUnbudgets,
  fetchUnbudgetDetail,
  fetchUnbudgetItems,
  fetchUnbudgets,
  submitUnbudgets,
} from './api';
import { Unbudget, UnbudgetDetail, UnbudgetItem } from './entities';

export const useFetchUnbudgets = (
  params: PaginateParams
): UseQueryResult<Paginate<Unbudget>, ResponseError> => {
  return useQuery(['unbudgets', params], () => fetchUnbudgets(params));
};

export const useFetchUnbudgetDetail = (
  idUnbudget: string
): UseQueryResult<UnbudgetDetail> => {
  return useQuery(
    ['unbudget-detail', idUnbudget],
    () => fetchUnbudgetDetail(idUnbudget),
    { enabled: !!idUnbudget }
  );
};

export const useFetchUnbudgetItems = (
  idUnbudget: string,
  params: PaginateParams
): UseQueryResult<Paginate<UnbudgetItem>, ResponseError> => {
  return useQuery(['unbudget-items', params], () =>
    fetchUnbudgetItems(idUnbudget, params)
  );
};

export const useDeleteUnbudgets = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idUnbudgets) => deleteUnbudgets(idUnbudgets));
};

export const useSubmitUnbudgets = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idUnbudgets) => submitUnbudgets(idUnbudgets));
};
