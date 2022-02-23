export enum ApprovalStatus {
  APPROVE = 'approved',
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
