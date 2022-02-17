import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchActualYtd } from './api';
import { ActualYtd } from './entities';

export const useFetchActualYtd = (
  params: PaginateParams
): UseQueryResult<Paginate<ActualYtd>, ResponseError> => {
  return useQuery(['actual-ytd', params], () => fetchActualYtd(params));
};
