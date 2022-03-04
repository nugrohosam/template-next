import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { useDeleteUnbudgets, useSubmitUnbudgets } from './hook';

export const useUnbudgetHelpers = () => {
  const deleteUnbudgetsMutation = useDeleteUnbudgets();
  const handleDeleteUnbudgets = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      deleteUnbudgetsMutation.mutate(ids, {
        onSuccess: (result) => {
          toast('Data Deleted!');
          resolve(result);
        },
        onError: (error) => {
          console.error('Failed to Delete data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
          reject(error);
        },
      });
    });
  };

  const submitUnbudgetsMutation = useSubmitUnbudgets();
  const handleSubmitUnbudgets = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      return submitUnbudgetsMutation.mutate(ids, {
        onSuccess: (result) => {
          toast('Data Submited!');
          resolve(result);
        },
        onError: (error) => {
          console.error('Failed to submit data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
          reject(error);
        },
      });
    });
  };

  return {
    deleteUnbudgetsMutation,
    handleDeleteUnbudgets,
    submitUnbudgetsMutation,
    handleSubmitUnbudgets,
  };
};
