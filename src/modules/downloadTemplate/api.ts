import fileDownload from 'js-file-download';
import axios from 'utils/axios';

export interface downloadTemplateParams {
  feature: string;
}

export const downloadTemplateExcel = async (
  params: downloadTemplateParams
): Promise<void> => {
  const result = await axios.get(`v1/exceltemplates`, {
    params,
    responseType: 'blob',
  });

  fileDownload(result.data, `template-${params.feature}.xlsx`);
};
