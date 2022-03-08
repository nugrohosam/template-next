import { ApprovalStatus } from 'modules/approval/entities';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { ApprovalUnbudgetForm, UnbudgetForm } from './entities';
import {
  useApprovalUnbudgets,
  useCancelUnbudgets,
  useCreateUnbudget,
  useDeleteUnbudgets,
  useSubmitUnbudgets,
  useUpdateUnbudget,
} from './hook';

export const useUnbudgetHelpers = () => {
  const mutationCreateUnbudget = useCreateUnbudget();
  const handleCreateUnbudget = (data: UnbudgetForm) => {
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
  const handleUpdateUnbudget = (idUnbudget: string, data: UnbudgetForm) => {
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

  const mutationDeleteUnbudgets = useDeleteUnbudgets();
  const handleDeleteUnbudgets = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      mutationDeleteUnbudgets.mutate(ids, {
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

  const mutationSubmitUnbudgets = useSubmitUnbudgets();
  const handleSubmitUnbudgets = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      mutationSubmitUnbudgets.mutate(ids, {
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

  const mutationCancelUnbudgets = useCancelUnbudgets();
  const handleCancelUnbudgets = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      mutationCancelUnbudgets.mutate(ids, {
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

  const mutationApprovalUnbudgets = useApprovalUnbudgets();
  const handleApprovalUnbudgets = (data: ApprovalUnbudgetForm) => {
    let message = {
      onSuccess: '',
      onError: '',
    };
    if (data.status === ApprovalStatus.Approve) {
      message.onSuccess = `Approved`;
      message.onError = `approve`;
    } else if (data.status === ApprovalStatus.Reject) {
      message.onSuccess = `Rejected`;
      message.onError = `reject`;
    } else if (data.status === ApprovalStatus.Revise) {
      message.onSuccess = `Revised`;
      message.onError = `revise`;
    }

    return new Promise((resolve, reject) => {
      mutationApprovalUnbudgets.mutate(data, {
        onSuccess: (result) => {
          resolve(result);
          toast(`Data ${message.onSuccess}!`);
        },
        onError: (error) => {
          reject(error);
          console.error(`Failed to ${message.onError} data`, error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      });
    });
  };

  return {
    mutationCreateUnbudget,
    handleCreateUnbudget,
    mutationUpdateUnbudget,
    handleUpdateUnbudget,
    mutationDeleteUnbudgets,
    handleDeleteUnbudgets,
    mutationSubmitUnbudgets,
    handleSubmitUnbudgets,
    mutationCancelUnbudgets,
    handleCancelUnbudgets,
    mutationApprovalUnbudgets,
    handleApprovalUnbudgets,
  };
};
