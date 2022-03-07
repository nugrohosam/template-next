import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { UnbudgetForm } from './entities';
import {
  useCancelUnbudgets,
  useCreateUnbudget,
  useDeleteUnbudgets,
  useSubmitUnbudgets,
  useUpdateUnbudget,
} from './hook';

export const useUnbudgetHelpers = () => {
  const mutationCreateUnbudget = useCreateUnbudget();
  const handleSubmitCreateUnbudget = (data: UnbudgetForm) => {
    return new Promise((resolve, reject) => {
      mutationCreateUnbudget.mutate(data, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data created!');
        },
        onError: (error) => {
          reject(error);
          console.error('Failed to create data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      });
    });
  };

  const mutationUpdateUnbudget = useUpdateUnbudget();
  const handleUpdateCreateUnbudget = (
    idUnbudget: string,
    data: UnbudgetForm
  ) => {
    return new Promise((resolve, reject) => {
      mutationUpdateUnbudget.mutate(
        { idUnbudget, data },
        {
          onSuccess: (result) => {
            resolve(result);
            toast('Data updated!');
          },
          onError: (error) => {
            reject(error);
            console.error('Failed to update data', error);
            toast(error.message, { autoClose: false });
            showErrorMessage(error);
          },
        }
      );
    });
  };

  const deleteUnbudgetsMutation = useDeleteUnbudgets();
  const handleDeleteUnbudgets = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      deleteUnbudgetsMutation.mutate(ids, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data Deleted!');
        },
        onError: (error) => {
          reject(error);
          console.error('Failed to Delete data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
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

  const cancelUnbudgetsMutation = useCancelUnbudgets();
  const handleCancelUnbudgets = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      cancelUnbudgetsMutation.mutate(ids, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data Canceled!');
        },
        onError: (error) => {
          reject(error);
          console.error('Failed to cancel data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      });
    });
  };

  return {
    mutationCreateUnbudget,
    handleSubmitCreateUnbudget,
    mutationUpdateUnbudget,
    handleUpdateCreateUnbudget,
    deleteUnbudgetsMutation,
    handleDeleteUnbudgets,
    submitUnbudgetsMutation,
    handleSubmitUnbudgets,
    cancelUnbudgetsMutation,
    handleCancelUnbudgets,
  };
};
