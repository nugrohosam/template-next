import { PaginateParams } from 'modules/common/types';

export type Audit = {
  id: string;
  resourceId: string;
  resourceType: string;
  statusFrom: string;
  statusTo: string;
  userNrp: string;
  userPosition: string;
  userName: string;
  workflowLevel: string;
  createdAt: string;
};

export enum ResourceType {
  Accrued = 'accrued',
  ProportionalCose = 'proportional_cost',
  BudgetPlanItemGroup = 'budget_plan_item_group',
  Unbudget = 'unbudget',
  Overbudget = 'overbudget',
}

export interface AuditPaginateParams extends PaginateParams {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: 'asc' | 'desc';
  order?: string;
  resourceType?: ResourceType;
  resourceId: string;
}
