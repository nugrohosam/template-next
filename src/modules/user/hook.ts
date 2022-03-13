import { Paginate, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchUsers, FetchUsersParams } from './api';
import { User } from './entities';

export const useFetchUsers = (
  params: FetchUsersParams
): UseQueryResult<Paginate<User>, ResponseError> => {
  return useQuery(['users', params], () => fetchUsers(params));
};
