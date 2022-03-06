import { toast } from 'react-toastify';
import { setValidationError, showErrorMessage } from 'utils/helpers';

import { UnbudgetForm } from './entities';
import {
  useCreateUnbudget,
  useDeleteUnbudgets,
  useSubmitUnbudgets,
} from './hook';

export const useUnbudgetHelpers = () => {
  const mutationCreateUnbudget = useCreateUnbudget();
  const handleSubmitCreateUnbudget = (data: UnbudgetForm) => {
    return new Promise((resolve, reject) => {
      mutationCreateUnbudget.mutate(data, {
        onSuccess: (result) => {
          toast('Data created!');
          resolve(result);
        },
        onError: (error) => {
          console.error('Failed to create data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
          reject(error);
        },
      });
    });
  };

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
      submitUnbudgetsMutation.mutate(ids, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data Submited!');
        },
        onError: (error) => {
          reject(error);
          console.error('Failed to submit data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      });
    });
  };

  return {
    mutationCreateUnbudget,
    handleSubmitCreateUnbudget,
    deleteUnbudgetsMutation,
    handleDeleteUnbudgets,
    submitUnbudgetsMutation,
    handleSubmitUnbudgets,
  };
};
