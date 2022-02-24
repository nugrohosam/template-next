export enum ApprovalStatus {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REVISE = 'REVISE',
}

export type Approval = {
  type: string;
  resourceId: Array<string>;
  status: ApprovalStatus;
  notes?: string;
};

export type ApprovalField = Pick<Approval, 'notes' | 'status'>;
