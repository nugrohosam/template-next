import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axiosNfs from 'utils/axiosNfs';

import { User } from './entities';

export interface FetchUsersParams extends PaginateParams {
  type: string;
}
export const fetchUsers = async (
  params: FetchUsersParams
): Promise<Paginate<User>> => {
  const result = await axiosNfs.get<ResponseData<Paginate<User>>>('v1/users', {
    params,
  });
  return result.data.data;
};
