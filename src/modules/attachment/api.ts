import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { Attachment } from './entities';

export const uploadAttachment = async (data: FormData): Promise<Attachment> => {
  const result = await axios.post<Attachment>('v1/attachment', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};
