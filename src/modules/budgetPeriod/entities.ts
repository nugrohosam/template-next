export type BudgetPeriod = {
  id: string;
  districtCode: string;
  year: number;
  type: string;
  position: string;
  status: string;
  openDate: string;
  closeDate: string;
};

export type BudgetPeriodForm = Omit<BudgetPeriod, 'id'>;
