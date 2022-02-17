export type OutstandingPrPo = {
  id: string;
  prCapex: string;
  district: string;
  budgetId: string;
  prItem: string;
  description: string;
  quantity: number;
  price: number;
  amountPo: number;
  amount: number;
  dateCreated: string;
  dateRequired: string;
  loadingError: string;
  currentStatus: string;
  prNumber: string;
  poNumber: string;
  remark: string;
  adjustmentCurrentPeriod: number;
  amountAdjustment: number;
  adjustmentEemark: string;
  action: string;
  year: number;
  period: string;
  createdAt: string;
};

export type OutstandingPrPoConfirmation = {
  idOutstandingPrPo: Array<string>;
  adjustmentCurrentPeriod: number;
  amountAdjustment: number;
  remark: string;
};

export type ConfirmationField = Pick<
  OutstandingPrPoConfirmation,
  'idOutstandingPrPo' | 'amountAdjustment'
>;
