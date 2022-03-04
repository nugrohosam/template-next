import { Currency } from 'constants/currency';
import { AssetGroup } from 'modules/assetGroup/entities';
import { Catalog } from 'modules/catalog/entities';

export type Unbudget = {
  id: string;
  budgetCode: string;
  currency: Currency;
  status: string;
  item: number;
  totalAmount: number;
  totalAmountUsd: number;
  workflowApprovalLevel: number;
  workflowApprovalNrp: [];
  workflowApprovalPosition: [];
  workflowApprovalName: [];
  createdAt: string;
};

export type UnbudgetDetail = Unbudget & {
  idCapexBudgetPlan: string;
  outstandingPlanPaymentAttachment: string;
  outstandingRetentionAttachment: string;
  unbudgetBackground: string;
  unbudgetImpactIfNotRealized: string;
  unbudgetAttachment: string;
  isBuilding: boolean;
  districtCode: string;
  divisionCode: string;
  departmentCode: string;
  periodYear: number;
  periodType: string;
};

export type UnbudgetItem = {
  id: string;
  budgetCode: string;
  catalog: Catalog;
  detail: string;
  pricePerUnit: number;
  currency: Currency;
  currencyRate: number;
  totalAmount: number;
  totalAmountUsd: number;
  items: ItemOfUnbudgetItem[];
  createdAt: string;
  assetGroup: AssetGroup;
};

export type ItemOfUnbudgetItem = {
  month: number;
  quantity: number;
  amount: number;
};
