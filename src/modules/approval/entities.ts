export enum ApprovalStatus {
  APPROVE = 'approve',
  REJECT = 'rejected',
  REVISE = 'revised',
}

export type Approval = {
  type: string;
  resourceId: Array<string>;
  status: ApprovalStatus;
  notes?: string;
};

export type ApprovalField = Pick<Approval, 'notes' | 'status'>;
