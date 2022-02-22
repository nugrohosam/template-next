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
  idOutstandingBudgets: Array<string>;
  adjustmentCurrentPeriod: number;
  adjustedSisaBudgetUsdS1CurrentPeriod: number;
  adjustedRealisasiSisaBudgetS1CurrentPeriod: number;
  adjustmentRemark: string;
};

export type confirmOutstandingBudgetField = {
  idOutstandingBudgets: Array<string>;
  totalPengajuanBudgetUsdS1CurrentPeriod: number;
  adjustedSisaBudgetUsdS1CurrentPeriod: number;
  originalQuantity: number;
  adjustedLeftInformation: number;
  realisasiSisaBudgetS1CurrentPeriod: number;
};
