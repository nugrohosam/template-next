import { BudgetReference } from 'modules/budgetReference/entities';

import { OverbudgetStatus } from './constant';

export type Overbudget = {
  id: string;
  budgetReference: string;
  currentBalance: number;
  overBudgetNumber: string;
  additionalBudgetPerUnit: number;
  overBudget: number;
  background: string;
  impactIfNotRealized: string;
  status: OverbudgetStatus;
  workflowApprovalLevel: number;
  workflowApprovalNrp: Array<string>;
  workflowApprovalPosition: Array<string>;
  workflowApprovalName: Array<string>;
  createdAt: string;
};

export type OverbudgetDetail = Overbudget & {
  budgetReference: BudgetReference;
  attachment: string;
  workflowApprovalId: number;
};

export interface OverbudgetForm {
  idBudgetReference: string;
  currentBalance: number;
  additionalBudgetPerUnit: number;
  overbudget: number;
  background: string;
  impactIfNotRealized: string;
  attachment: string;
  status: OverbudgetStatus;

  // save file
  attachmentFile?: File[];
}

export type ApprovalOverbudgets = {
  idOverbudgets: string[];
  status: string;
  remark?: string;
};
