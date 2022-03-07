import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { DownloadAttachmentParams } from './api';
import { Attachment } from './entities';
import { useDownloadCatalogExcel, useUploadAttachment } from './hook';

export const useAttachmentHelpers = () => {
  const downloadAttachmanetMutation = useDownloadCatalogExcel();
  const handleDownloadAttachment = (params: DownloadAttachmentParams) => {
    downloadAttachmanetMutation.mutate(params, {
      onSuccess: () => {
        toast('File downloaded successfully!');
      },
      onError: (error) => {
        toast('Failed to download file', { autoClose: false });
        toast(error.message, { autoClose: false });
        showErrorMessage(error);
      },
    });
  };

  const mutationUploadAttachment = useUploadAttachment();
  const handleUploadAttachment = (attachment: File[], module: string) => {
    return new Promise<Attachment>((resolve, reject) => {
      const formData = new FormData();
      formData.append('module', module);
      if (attachment.length) {
        formData.append('attachment', attachment[0]);
      }

      mutationUploadAttachment.mutate(formData, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data uploaded!');
        },
        onError: (error) => {
          reject(error);
          toast(error.message, { autoClose: false });
        },
      });
    });
  };

  return {
    downloadAttachmanetMutation,
    handleDownloadAttachment,
    mutationUploadAttachment,
    handleUploadAttachment,
  };
};
