export enum ApprovalStatus {
  APPROVE = 'approve',
  REJECT = 'reject',
  REVISE = 'revise',
}

export type Approval = {
  type: string;
  resourceId: Array<string>;
  status: ApprovalStatus;
  notes?: string;
};

export type ApprovalField = Pick<Approval, 'notes' | 'status'>;
