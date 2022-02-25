import { ItemOfBudgetPlanItem } from './entities';

export function getItemByMonth(items: ItemOfBudgetPlanItem[], month: number) {
  return items.find((item) => item.month == month);
}
