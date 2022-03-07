import { Currency } from 'constants/currency';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

import { BudgetPlanItemForm, ItemOfBudgetPlanItem } from './entities';
import { useCreateBudgetPlanItem, useUpdateBudgetPlanItem } from './hook';

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
      currency === Currency.USD ? 'en-En' : 'id-Id'
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

  return {
    mutationCreateBudgetPlanItem,
    handleCreateBudgetPlanItem,
    mutationUpdateBudgetPlanItem,
    handleUpdateBudgetPlanItem,
  };
};
