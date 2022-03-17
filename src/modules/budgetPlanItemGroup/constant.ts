export enum BudgetPlanItemGroupStatus {
  Submit = 'SUBMIT',
  Draft = 'DRAFT',
  Approve = 'APPROVE',
  WaitingApproval = 'WAITING APPROVAL',
  WaitingApprovalByHo = 'WAITING APPROVAL By HO',
  Cancel = 'CANCEL',
  Delete = 'DELETE',
  Final = 'FINAL',
  Reject = 'REJECT',
  Revise = 'REVISE',
  WaitingApprovalPicAssetHo = 'WAITING APPROVAL PIC ASSET HO',
}

export const BudgetPlanItemGroupStatusOptions = [
  { label: 'DRAFT', value: BudgetPlanItemGroupStatus.Draft },
  { label: 'REVISE', value: BudgetPlanItemGroupStatus.Revise },
  {
    label: 'WAITING APPROVAL',
    value: BudgetPlanItemGroupStatus.WaitingApproval,
  },
  {
    label: 'WAITING APPROVAL PIC ASSET HO',
    value: BudgetPlanItemGroupStatus.WaitingApprovalPicAssetHo,
  },
  { label: 'FINAL', value: BudgetPlanItemGroupStatus.Final },
  { label: 'REJECT', value: BudgetPlanItemGroupStatus.Reject },
];
