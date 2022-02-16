export type outstandingBudget = {
  id: string;
  budgetId: string;
  district: string;
  department: string;
  detail: string;
  leftInformation: number;
  usedInformation: number;
  originalSisaBudgetUsdS1CurrentPeriod: number;
  originalQuantity: number;
  realisasiSisaBudgetS1CurrentPeriod: number;
  adjustedLeftInformation: number;
  quantityRealisasiS1CurrentPeriod: number;
  totalPengajuanBudgetUsdS1CurrentPeriod: number;
  adjustmentCurrentPeriod: number;
  adjustedSisaBudgetUsdS1CurrentPeriod: number;
  adjustmentRemark: string;
  adjustedRealisasiSisaBudgetS1CurrentPeriod: number;
  action: string;
  year: number;
  period: string;
  createdAt: string;
};

export type confirmOutstandingBudget = {
  idOutstandingBudgets: string[];
  adjustmentCurrentPeriod: number;
  amountAdjustment: number;
  remark: string;
};
