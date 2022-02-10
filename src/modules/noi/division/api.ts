import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';
import axiosNfs from 'utils/axiosNfs';

import { NoiDivision } from './entities';

export const fetchNoiDivision = async (
  params: PaginateParams
): Promise<Paginate<NoiDivision>> => {
  const result = await axiosNfs.get<ResponseData<Paginate<NoiDivision>>>(
    `v1/noi/division`,
    { params }
  );
  return result.data.data;
};
