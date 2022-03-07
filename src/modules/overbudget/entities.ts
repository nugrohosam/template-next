import { OverBudgetStatus } from 'constants/status';
import { BudgetReference } from 'modules/budgetReference/entities';

export type OverBudget = {
  id: string;
  budgetReference: string;
  currentBalance: number;
  overBudgetNumber: string;
  additionalBudgetPerUnit: number;
  overBudget: number;
  background: string;
  impactIfNotRealized: string;
  status: OverBudgetStatus;
  workflowApprovalLevel: number;
  workflowApprovalNrp: Array<string>;
  workflowApprovalPosition: Array<string>;
  workflowApprovalName: Array<string>;
  createdAt: string;
};

export type OverBudgetDetail = OverBudget & {
  budgetReference: BudgetReference;
  attachment: string;
  description: string;
  quantity: number;
  workflowApprovalId: number;
};
