import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { DownloadAttachmentParams } from './api';
import { useDownloadCatalogExcel } from './hook';

export const useDownloadAttachmentHelpers = () => {
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

  return { handleDownloadAttachment };
};
