import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { useDownloadTemplateExcel } from './hook';

export const useDownloadTemplateHelpers = () => {
  const downloadTemplateExcelMutation = useDownloadTemplateExcel();

  const handleDownloadTemplate = (feature: string) => {
    downloadTemplateExcelMutation.mutate(
      { feature },
      {
        onSuccess: () => {
          toast('Excel Template file downloaded successfully!');
        },
        onError: (error) => {
          toast('Failed to download file', { autoClose: false });
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

  return { handleDownloadTemplate };
};
