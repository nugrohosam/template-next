import { SelectOption } from 'components/form/SingleSelect';

export const accruedStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  APPROVED: 'APPROVED',
  REVISED: 'REVISED',
  REJECTED: 'REJECTED',
  FINAL: 'FINAL',
};

export enum OverBudgetStatus {
  DRAFT = 'DRAFT',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  REVISE = 'REVISE',
  REJECT = 'REJECT',
  DONE = 'DONE',
  CANCEL = 'CANCEL',
  SUBMIT = 'SUBMIT',
}

export const overBudgetStatusOptions: SelectOption[] = [
  { label: 'DRAFT', value: OverBudgetStatus.DRAFT },
  { label: 'WAITING APPROVAL', value: 'WAITING_APPROVAL' },
  { label: 'REVISE', value: OverBudgetStatus.REVISE },
  { label: 'REJECT', value: OverBudgetStatus.REJECT },
  { label: 'DONE', value: OverBudgetStatus.DONE },
  { label: 'CANCEL', value: OverBudgetStatus.CANCEL },
];
