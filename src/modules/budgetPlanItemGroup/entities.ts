import { Currency } from 'constants/currency';
import { BudgetPlanItem } from 'modules/budgetPlanItem/entities';

export enum BudgetPlanItemGroupStatus {
  Draft = 'DRAFT',
}

export enum BuildingAttachmentType {
  OutstandingPlanPayment = 'OUTSTANDING PLAN PAYMENT',
  OutstandingRetention = 'OUTSTANDING RETENTION',
}

export type BudgetPlanItemGroup = {
  id: string;
  budgetCode: string;
  currency: Currency;
  status: string;
  item: number;
  totalAmount: number;
  totalAmountUsd: number;
  outstandingPlanPaymentAttachment: string;
  outstandingRetentionAttachment: string;
  isBuilding: boolean;
  workflowApprovalLevel: number;
  workflowApprovalNrp: [];
  workflowApprovalPosition: [];
  workflowApprovalName: [];
  createdAt: string;
};

export type BudgetPlanItemGroupItem = BudgetPlanItem & {
  detail: string;
  budgetCode: string;
  assetGroup: string;
};

export interface ApprovalBudgetPlanItemGroup {
  idBudgetPlanItemGroups: string[];
  status: string;
  remark?: string;
}

export type BuildingAttachment = {
  id: string;
  type: string;
  districtCode: string;
  detail: string;
  currency: string;
  currentPeriodIdr: number;
  currentPeriodUsd: number;
  mbIdr: number;
  mbUsd: number;
};
