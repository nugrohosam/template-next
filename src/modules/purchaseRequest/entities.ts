export type PurchaseRequest = {
  id: string;
  prNumber: string;
  prNumberEllipse: string;
  currency: string;
  quantityRequired: number;
  requestedBy: string;
  supplierRecommendation: string;
  supplierRecommendationName: string;
  estimatedPriceUsd: number;
  status: string;
  statusPo: string;
};

export type PurchaseRequestItem = {
  item: string;
  description_1: string;
  description_2: string;
  description_3: string;
  description_4: string;
  partNo: string;
  mnemonic: string;
  uom: string;
  quantity: number;
  priceUsd: number;
};

export type PurchaseRequestForm = {
  idCapexAssetGroup: string;
  idBudgetReference: string;
  prDate: string;
  requestedBy: string;
  dateRequired: string;
  districtCode: string;
  departmentCode: string;
  deliveryPoint: string;
  coa: string;
  warehouse: string;
  currency: string;
  supplierRecommendation: string;
  supplierRecommendationName: string;
  quantityRequired: number;
  estimatedPriceUsd: number;
  description: string;
  purchaser: string;
  deliveryInstruction: string;
  authorizedBy: string;
  materialGroup: string;
  picAsset: string;
  warrantyHoldPayment: boolean;
  uom: string;
  districtCodePembebanan: string;
  attachment?: string | Array<File> | null;
  budgetQtyBalance: number;
  budgetAmountBalance: number;
  currencyRate: number;
  status: string;
  items: PurchaseRequestItem[];
};
