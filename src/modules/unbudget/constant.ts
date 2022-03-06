export enum UnbudgetStatus {
  Draft = 'DRAFT',
  Cancel = 'CANCEL',
  Waiting = 'WAITING',
  Approval = 'APPROVAL',
}

export const UnbudgetStatusOptions = [
  { label: 'DRAFT', value: UnbudgetStatus.Draft },
  { label: 'CANCEL', value: UnbudgetStatus.Cancel },
  { label: 'WAITING', value: UnbudgetStatus.Waiting },
  { label: 'APPROVAL', value: UnbudgetStatus.Approval },
];
