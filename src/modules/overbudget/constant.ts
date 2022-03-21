import { SelectOption } from 'components/form/SingleSelect';

export enum OverbudgetStatus {
  Draft = 'DRAFT',
  WaitingApproval = 'WAITING APPROVAL',
  Revise = 'REVISE',
  Reject = 'REJECT',
  Done = 'DONE',
  Cancel = 'CANCEL',
  Submit = 'SUBMIT',
}

export const overbudgetStatusOptions: SelectOption[] = [
  { label: 'DRAFT', value: OverbudgetStatus.Draft },
  { label: 'WAITING APPROVAL', value: OverbudgetStatus.WaitingApproval },
  { label: 'REVISE', value: OverbudgetStatus.Revise },
  { label: 'REJECT', value: OverbudgetStatus.Reject },
  { label: 'DONE', value: OverbudgetStatus.Done },
  { label: 'CANCEL', value: OverbudgetStatus.Cancel },
];
