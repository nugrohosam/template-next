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
  idBudgetPlanItemGroup: string;
  outstandingPlanPaymentAttachment?: string | null;
  outstandingRetentionAttachment?: string | null;
  isBuilding: boolean;
  budgetPlanItems: BudgetPlanItemOfBudgetPlanItemForm[];

  // Save File
  outstandingRetentionAttachmentFile?: File[] | null;
  outstandingPlanPaymentAttachmentFile?: File[] | null;
}

export interface BudgetPlanItemOfBudgetPlanItemForm {
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

export interface UploadBudgetPlanItemUForm {
  file: File[];
  idBudgetPlan: string;
}
