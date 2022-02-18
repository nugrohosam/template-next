import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';

import { deleteActualYtds, fetchActualYtd } from './api';
import { ActualYtd } from './entities';

export const useFetchActualYtd = (
  params: PaginateParams
): UseQueryResult<Paginate<ActualYtd>, ResponseError> => {
  return useQuery(['actual-ytd', params], () => fetchActualYtd(params));
};

export const useDeleteActualYtds = (): UseMutationResult<
  null,
  ResponseError,
  string[]
> => {
  return useMutation((idActualYtds) => deleteActualYtds(idActualYtds));
};
