export enum ApprovalStatus {
  Approve = 'APPROVE',
  Reject = 'REJECT',
  Revise = 'REVISE',
}

export type Approval = {
  type: string;
  resourceId: Array<string>;
  status: ApprovalStatus;
  notes?: string;
};

export type ApprovalField = Pick<Approval, 'notes' | 'status'>;
