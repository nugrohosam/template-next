import { Currency } from 'constants/currency';

import { ItemOfBudgetPlanItem } from './entities';

export function getItemByMonth(items: ItemOfBudgetPlanItem[], month: number) {
  return items.find((item) => item.month == month);
}

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
