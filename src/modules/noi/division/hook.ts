import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import {
  UseBaseQueryOptions,
  UseBaseQueryResult,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';

import { fetchNoiDivision } from './api';
import { NoiDivision } from './entities';

export const useFetchNoiDivision = (
  params: PaginateParams
): UseQueryResult<Paginate<NoiDivision>, ResponseError> => {
  return useQuery(['noi-division', params], () => fetchNoiDivision(params), {
    enabled: !!params.search,
  });
};
