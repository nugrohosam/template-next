import { rejects } from 'assert';
import { UserType } from 'constants/user';
import { ApprovalStatus } from 'modules/approval/entities';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { BudgetPlanItemGroupStatus } from './constant';
import { ApprovalBudgetPlanItemGroup, DelegateApprovalForm } from './entities';
import {
  useApprovalBudgetPlanItemGroups,
  useDelegateApproval,
  useDeleteBudgetPlanItemGroups,
  useSubmitBudgetPlanItemGroups,
} from './hook';

export const useBudgetPlanItemGroupHelpers = () => {
  const mutationSubmitBudgetPlanItemGroup = useSubmitBudgetPlanItemGroups();
  const handleSubmitBudgetPlanItemGroups = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      mutationSubmitBudgetPlanItemGroup.mutate(ids, {
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

  const mutationDeleteBudgetPlanItemGroup = useDeleteBudgetPlanItemGroups();
  const handleDeleteBudgetPlanItemGroups = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      mutationDeleteBudgetPlanItemGroup.mutate(ids, {
        onSuccess: (result) => {
          resolve(result);
          toast('Data Deleted!');
        },
        onError: (error) => {
          reject(error);
          console.error('Failed to delete data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      });
    });
  };

  const mutationApprovalBudgetPlanItemGroup = useApprovalBudgetPlanItemGroups();
  const handleApprovalBudgetPlanItemGroup = (
    data: ApprovalBudgetPlanItemGroup
  ) => {
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
      mutationApprovalBudgetPlanItemGroup.mutate(data, {
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

  const mutationDelegateApproval = useDelegateApproval();
  const handleDelegateApproval = (
    idBudgetPlanItemGroup: string,
    data: DelegateApprovalForm
  ) => {
    return new Promise((resolve, reject) => {
      mutationDelegateApproval.mutate(
        { idBudgetPlanItemGroup, data },
        {
          onSuccess: (result) => {
            resolve(result);
            toast(`Successfully delegate approval!`);
          },
          onError: (error) => {
            reject(error);
            console.error(`Failed to delegate approval`, error);
            toast(error.message, { autoClose: false });
            showErrorMessage(error);
          },
        }
      );
    });
  };

  return {
    mutationSubmitBudgetPlanItemGroup,
    handleSubmitBudgetPlanItemGroups,
    mutationDeleteBudgetPlanItemGroup,
    handleDeleteBudgetPlanItemGroups,
    mutationApprovalBudgetPlanItemGroup,
    handleApprovalBudgetPlanItemGroup,
    mutationDelegateApproval,
    handleDelegateApproval,
  };
};

export const permissionBudgetPlanItemGroupHelpers = (
  role: string | undefined
) => {
  const userCanHandleData =
    role === UserType.AdminCapex || role === UserType.PicCapex;
  const userCanApproveData =
    role === UserType.ApprovalBudgetPlanCapex ||
    role === UserType.DeptPicAssetHoCapex;
  const userCanDelegateApproval = role === UserType.AdminCapex;

  const canSubmit = (status: string | undefined) => {
    if (!userCanHandleData) return false;
    const statusAccess = [
      BudgetPlanItemGroupStatus.Draft,
      BudgetPlanItemGroupStatus.Revise,
    ];
    return statusAccess.includes(status as BudgetPlanItemGroupStatus);
  };

  const canApprove = (status: string | undefined) => {
    if (!userCanApproveData) return false;
    return status?.includes(BudgetPlanItemGroupStatus.WaitingApproval);
  };

  const canDelegateApprove = (status: string | undefined) => {
    if (!userCanDelegateApproval) return false;
    return status?.includes(BudgetPlanItemGroupStatus.WaitingApproval);
  };

  return {
    userCanHandleData,
    userCanApproveData,
    userCanDelegateApproval,
    canSubmit,
    canApprove,
    canDelegateApprove,
  };
};
