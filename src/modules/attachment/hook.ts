import { ResponseError } from 'modules/common/types';
import { useMutation, UseMutationResult } from 'react-query';

import {
  downloadAttachment,
  DownloadAttachmentParams,
  uploadAttachment,
} from './api';
import { Attachment } from './entities';

export const useUploadAttachment = (): UseMutationResult<
  Attachment,
  ResponseError,
  FormData
> => {
  return useMutation(uploadAttachment);
};

export const useDownloadCatalogExcel = (): UseMutationResult<
  void,
  ResponseError,
  DownloadAttachmentParams
> => {
  return useMutation(downloadAttachment);
};
