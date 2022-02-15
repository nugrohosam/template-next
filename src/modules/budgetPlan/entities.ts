export type BudgetPlan = {
  id: string;
  periodType: string;
  periodYear: number;
  districtCode: string;
  divisionCode: string;
  departmentCode: string;
  reviewBodDueDate: string;
  createdAt: string;
};

export interface BudgetPlanForm {
  periodType: string;
  periodYear: number;
  districtCode: string;
  divisionCode: string;
  departmentCode: string;
}
