import { UserType } from 'constants/user';
import { ApprovalStatus } from 'modules/approval/entities';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { OverbudgetStatus } from './constant';
import { ApprovalOverbudgets, OverbudgetForm } from './entities';
import {
  useApprovalOverbudgets,
  useCreateOverbudget,
  useDeleteOverbudgets,
  useSubmitOverbudgets,
  useUpdateOverbudget,
} from './hook';

export const useOverbudgetHelpers = () => {
  const mutationCreateOverbudget = useCreateOverbudget();
  const handleCreateOverbudget = (data: OverbudgetForm) => {
    return new Promise((resolve, reject) => {
      mutationCreateOverbudget.mutate(data, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data Created!');
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

  const mutationUpdateOverbudget = useUpdateOverbudget();
  const handleUpdateOverbudget = (
    idOverbudget: string,
    data: OverbudgetForm
  ) => {
    return new Promise((resolve, reject) => {
      mutationUpdateOverbudget.mutate(
        { idOverbudget, data },
        {
          onSuccess: (result) => {
            resolve(result);
            toast('Data Updated!');
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

  const mutationSubmitOverbudgets = useSubmitOverbudgets();
  const handleSubmitOverbudgets = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      mutationSubmitOverbudgets.mutate(ids, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data Submited!');
        },
        onError: (error) => {
          reject(error);
          console.log('Failed to submit data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      });
    });
  };

  const mutationCancelOrDeleteOverbudgets = useDeleteOverbudgets();
  const handleCancelOrDeleteOverbudgets = (ids: string[], action: string) => {
    let message = {
      onSuccess: '',
      onError: '',
    };
    if (action === 'DELETE') {
      message.onSuccess = 'Deleted';
      message.onError = 'delete';
    } else if (action === 'CANCEL') {
      message.onSuccess = 'Canceled';
      message.onError = 'cancel';
    }
    return new Promise((resolve, reject) => {
      mutationCancelOrDeleteOverbudgets.mutate(
        {
          idOverbudgets: ids,
          action,
        },
        {
          onSuccess: (result) => {
            resolve(result);
            toast(`Data ${message.onSuccess}!`);
          },
          onError: (error) => {
            reject(error);
            console.log(`Failed to ${message.onError} data`, error);
            toast(error.message, { autoClose: false });
            showErrorMessage(error);
          },
        }
      );
    });
  };

  const mutationApprovalOverbudget = useApprovalOverbudgets();
  const handleApprovalOverbudgets = (data: ApprovalOverbudgets) => {
    let message = {
      onSuccess: '',
      onError: '',
    };
    if (data.status === ApprovalStatus.Approve) {
      message.onSuccess = 'Aproved';
      message.onError = 'approve';
    } else if (data.status === ApprovalStatus.Reject) {
      message.onSuccess = 'Rejected';
      message.onError = 'reject';
    } else if (data.status === ApprovalStatus.Reject) {
      message.onSuccess = 'Revised';
      message.onError = 'revise';
    }
    return new Promise((resolve, reject) => {
      mutationApprovalOverbudget.mutate(data, {
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
    mutationSubmitOverbudgets,
    handleSubmitOverbudgets,
    mutationCancelOrDeleteOverbudgets,
    handleCancelOrDeleteOverbudgets,
    handleApprovalOverbudgets,
    mutationCreateOverbudget,
    handleCreateOverbudget,
    mutationUpdateOverbudget,
    handleUpdateOverbudget,
  };
};

export const permissionOverbudgetHelpers = (role: string | undefined) => {
  const userCanHandleData = role === UserType.PicCapex;
  const userCanApproveData = role === UserType.ApprovalBudgetPlanCapex;

  const canSubmit = (status: string | undefined) => {
    if (!userCanHandleData) return false;
    const statusAccess = [OverbudgetStatus.Draft, OverbudgetStatus.Revise];
    return statusAccess.includes(status as OverbudgetStatus);
  };

  const canCancel = (status: string | undefined) => {
    if (!userCanHandleData) return false;
    const statusAccess = [OverbudgetStatus.Draft, OverbudgetStatus.Revise];
    return statusAccess.includes(status as OverbudgetStatus);
  };

  const canDelete = (status: string | undefined) => {
    if (!userCanHandleData) return false;
    const statusAccess = [
      OverbudgetStatus.Draft,
      OverbudgetStatus.Revise,
      OverbudgetStatus.Cancel,
    ];
    return statusAccess.includes(status as OverbudgetStatus);
  };

  const canEdit = (status: string | undefined) => {
    if (!userCanHandleData) return false;
    const statusAccess = [OverbudgetStatus.Draft, OverbudgetStatus.Revise];
    return statusAccess.includes(status as OverbudgetStatus);
  };

  return {
    userCanHandleData,
    userCanApproveData,
    canSubmit,
    canCancel,
    canDelete,
    canEdit,
  };
};
