import { Catalog } from 'modules/catalog/entities';

export type BudgetPlanItem = {
  id: string;
  catalog: Catalog;
  pricePerUnit: number;
  currency: string;
  currencyRate: number;
  totalAmount: number;
  totalAmountUsd: number;
  items: ItemOfBudgetPlanItem[];
  createdAt: string;
};

export type ItemOfBudgetPlanItem = {
  month: number;
  quantity: number | string;
  amount: number;
};

export interface BudgetPlanItemForm {
  idCapexCatalog: string;
  pricePerUnit: number;
  currency: string;
  currencyRate: number;
  totalAmount: number;
  totalAmountUsd: number;
  items: ItemOfBudgetPlanItem[];
}

export interface CreateBudgetPlanItemsForm {
  idCapexBudgetPlan: string;
  budgetPlanItems: BudgetPlanItemForm;
}
