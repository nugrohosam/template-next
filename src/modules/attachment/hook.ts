import { ResponseError } from 'modules/common/types';
import { useMutation, UseMutationResult } from 'react-query';

import { uploadAttachment } from './api';
import { Attachment } from './entities';

export const useUploadAttachment = (): UseMutationResult<
  Attachment,
  ResponseError,
  FormData
> => {
  return useMutation(uploadAttachment);
};
