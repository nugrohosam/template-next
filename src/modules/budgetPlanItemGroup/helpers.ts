import { UserType } from 'constants/user';
import { ApprovalStatus } from 'modules/approval/entities';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { BudgetPlanItemGroupStatus } from './constant';
import { ApprovalBudgetPlanItemGroup } from './entities';
import { useApprovalBudgetPlanItemGroups } from './hook';

export const useBudgetPlanItemGroupHelpers = () => {
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

  return {
    mutationApprovalBudgetPlanItemGroup,
    handleApprovalBudgetPlanItemGroup,
  };
};

export const permissionBudgetPlanItemGroupHelpers = (
  role: string | undefined
) => {
  const userCanApproveData = role === UserType.DeptPicAssetHoCapex;

  const canApprove = (status: string | undefined) => {
    if (!userCanApproveData) return false;
    const statusAccess = [BudgetPlanItemGroupStatus.WaitingApprovalPicAssetHo];
    return statusAccess.includes(status as BudgetPlanItemGroupStatus);
  };

  return { userCanApproveData, canApprove };
};
