import { PeriodeType } from '../../constants/period';
export type Summary = {
  districtCode: string;
  actualYtdCurrentPeriod: number;
  outstandingPrPo: number;
  outstandingBudgets: number;
  totalOutstanding: number;
  totalEstimateFullYearCurrentPeriod: number;
  adjustmentOutstandingPrPo: number;
  adjustmentOutstandingBudgets: number;
  totalAdjustmentCurrentPeriod: number;
  outstandingPlanS2CurrentPeriod: number;
  estimaterOutlookFyCurrentPeriod: number;
  approvalCapex: number;
  carryOverPrPreviousePeriod: number;
  carryOverPlanPreviousePeriod: number;
  totalMb: number;
  mbVsOlFyCurrentPeriod: number;
  mbVsOlFyCurrentPeriodPercentage: number;
};

export type TotalSummaryData = Omit<Summary, 'districtCode'>;

export type AssetGroupSummary = {
  districtType: string;
  summaryData: Summary[];
};

export type InterveneField = {
  type: string;
  intervene: number;
  amountLimitation: number;
  remark: string;
  assetGroupCode: string;
  districtCode?: string;
  year: number;
  period: PeriodeType;
};

export type InterveneData = {
  totalAmount: number;
  districtCode?: string;
};
