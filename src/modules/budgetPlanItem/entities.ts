import { Currency } from 'constants/currency';
import { Catalog } from 'modules/catalog/entities';

export type BudgetPlanItem = {
  id: string;
  catalog: Catalog;
  pricePerUnit: number;
  currency: Currency;
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
  outstandingPlanPaymentAttachment?: string | Array<File> | null;
  outstandingRetentionAttachment?: string | Array<File> | null;
  isBuilding: boolean;
  budgetPlanItems: ItemOfBudgetPlanItemForm[];
}

export interface ItemOfBudgetPlanItemForm {
  idAssetGroup: string;
  idCapexCatalog: string | null;
  pricePerUnit: number | null;
  currency: Currency | null;
  currencyRate: number;
  totalAmount: number;
  totalAmountUsd: number;
  items: ItemOfBudgetPlanItem[];
  detail: string | null;
  id?: string;
  catalog?: Catalog;
}

export interface UploadExcelBudgetPlanItem {
  idBudgetPlan: string;
  file: Array<File>;
}
