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
  quantity: number;
  amount: number;
};

export interface BudgetPlanItemForm {
  idCapexBudgetPlan: string;
  outstandingPlanPaymentAttachment?: string | null;
  outstandingRetentionAttachment?: string | null;
  isBuilding: boolean;
  budgetPlanItems: ItemOfBudgetPlanItemForm[];
}

export interface ItemOfBudgetPlanItemForm {
  idAssetGroup: string;
  idCapexCatalog: string;
  pricePerUnit: number;
  currency: string;
  currencyRate: number;
  totalAmount: number;
  totalAmountUsd: number;
  items: ItemOfBudgetPlanItem[];
  id?: string;
  catalog?: Catalog;
}
