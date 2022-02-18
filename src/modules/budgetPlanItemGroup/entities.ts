import { BudgetPlanItem } from 'modules/budgetPlanItem/entities';

export type BudgetPlanItemGroup = {
  id: string;
  budgetCode: string;
  currency: string;
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

export type BudgetPlanItemGroupItem = BudgetPlanItem & {
  detail: string;
  budgetCode: string;
};
