import { ResponseError } from 'modules/common/types';
import { useMutation, UseMutationResult } from 'react-query';

import { downloadTemplateExcel, downloadTemplateParams } from './api';

export const useDownloadTemplateExcel = (): UseMutationResult<
  void,
  ResponseError,
  downloadTemplateParams
> => {
  return useMutation((params) => downloadTemplateExcel(params));
};
