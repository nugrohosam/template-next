import { Currency } from 'constants/currency';
import { UserType } from 'constants/user';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { BudgetPlanItemStatus } from './constant';
import { BudgetPlanItemForm, ItemOfBudgetPlanItem } from './entities';
import {
  useCreateBudgetPlanItem,
  useDeleteBudgetPlanitems,
  useUpdateBudgetPlanItem,
} from './hook';

export function getValueItemByMonth(
  items: ItemOfBudgetPlanItem[],
  month: number,
  isBuilding: boolean,
  currency: Currency
) {
  const foundItem = items.find((item) => item.month == month);
  if (!foundItem) return '-';

  if (isBuilding) {
    const amount = +foundItem.amount;
    return amount?.toLocaleString(
      currency === Currency.Usd ? 'en-En' : 'id-Id'
    );
  } else {
    return foundItem.quantity;
  }
}

export const useBudgetPlanItemHelpers = () => {
  const mutationCreateBudgetPlanItem = useCreateBudgetPlanItem();
  const handleCreateBudgetPlanItem = (data: BudgetPlanItemForm) => {
    return new Promise((resolve, reject) => {
      mutationCreateBudgetPlanItem.mutate(data, {
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

  const mutationUpdateBudgetPlanItem = useUpdateBudgetPlanItem();
  const handleUpdateBudgetPlanItem = (data: BudgetPlanItemForm) => {
    return new Promise((resolve, reject) => {
      mutationUpdateBudgetPlanItem.mutate(data, {
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
      });
    });
  };

  const mutationDeleteBudgetPlanItems = useDeleteBudgetPlanitems();
  const handleDeleteBudgetPlanItems = (ids: string[]) => {
    return new Promise((resolve, reject) => {
      mutationDeleteBudgetPlanItems.mutate(ids, {
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

  return {
    mutationCreateBudgetPlanItem,
    handleCreateBudgetPlanItem,
    mutationUpdateBudgetPlanItem,
    handleUpdateBudgetPlanItem,
    mutationDeleteBudgetPlanItems,
    handleDeleteBudgetPlanItems,
  };
};

export const permissionBudgetPlanItemHelpers = (role: string | undefined) => {
  const userCanHandleData =
    role === UserType.AdminCapex || role === UserType.PicCapex;

  const canEdit = (status: string | undefined) => {
    if (!userCanHandleData) return false;
    const statusAccess = [
      BudgetPlanItemStatus.Draft,
      BudgetPlanItemStatus.Reject,
      BudgetPlanItemStatus.Revise,
    ];
    return statusAccess.includes(status as BudgetPlanItemStatus);
  };

  const canDelete = (status: string | undefined) => {
    if (!userCanHandleData) return false;
    const statusAccess = [BudgetPlanItemStatus.Draft];
    return statusAccess.includes(status as BudgetPlanItemStatus);
  };

  return { userCanHandleData, canEdit, canDelete };
};
