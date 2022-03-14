import { Currency } from 'constants/currency';
import { AssetGroup } from 'modules/assetGroup/entities';
import { BudgetPlanItem } from 'modules/budgetPlanItem/entities';

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
  delegateApprovalNrp: string;
  delegateApprovalPosition: string;
  delegateApprovalName: string;
  delegateAttachment: string;
  createdAt: string;
};

export type BudgetPlanItemGroupItem = BudgetPlanItem & {
  detail: string;
  budgetCode: string;
  assetGroup: AssetGroup;
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

export interface DelegateApprovalForm {
  nrp: string;
  attachment: string;

  // Save File
  attachmentFile?: File[];
}
