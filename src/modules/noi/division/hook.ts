import { Paginate, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchNoiDivision, NoiDivisionPaginateParams } from './api';
import { NoiDivision } from './entities';

export const useFetchNoiDivision = (
  params: NoiDivisionPaginateParams
): UseQueryResult<Paginate<NoiDivision>, ResponseError> => {
  return useQuery(['noi-division', params], () => fetchNoiDivision(params), {
    enabled: true,
  });
};
