import { BudgetPlanItemGroup } from 'modules/budgetPlanItemGroup/entities';

export type PendingTask = BudgetPlanItemGroup & {
  assetGroup: string;
  budgetPlanId: string;
};
