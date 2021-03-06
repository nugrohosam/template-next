export enum UnbudgetStatus {
  Draft = 'DRAFT',
  Cancel = 'CANCEL',
  Waiting = 'WAITING',
  Approval = 'APPROVAL',
  Revise = 'REVISE',
}

export const UnbudgetStatusOptions = [
  { label: 'DRAFT', value: UnbudgetStatus.Draft },
  { label: 'CANCEL', value: UnbudgetStatus.Cancel },
  { label: 'WAITING APPROVAL', value: UnbudgetStatus.Waiting },
];
