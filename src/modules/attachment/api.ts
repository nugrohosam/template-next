import fileDownload from 'js-file-download';
import axios from 'utils/axios';

import { Attachment } from './entities';

export const uploadAttachment = async (data: FormData): Promise<Attachment> => {
  const result = await axios.post<Attachment>('v1/attachment', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

export interface DownloadAttachmentParams {
  fileName: string;
  module: string;
}
export const downloadAttachment = async (
  params: DownloadAttachmentParams
): Promise<void> => {
  const result = await axios.get(`v1/attachment`, {
    params,
    responseType: 'blob',
  });

  fileDownload(result.data, params.fileName);
};
