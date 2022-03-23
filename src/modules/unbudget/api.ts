import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import {
  SomeObject
} from './entities';

export const fetch = async (
  params: PaginateParams
): Promise<Paginate<SomeObject>> => {
  const result = await axios.get<ResponseData<Paginate<SomeObject>>>(
    'v1/example',
    { params }
  );

  return result.data.data;
};

