import { AssetGroup } from 'modules/assetGroup/entities';
import { BudgetReference } from 'modules/budgetReference/entities';

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
  warrantyHoldPayment: string;
  uom: string;
  districtCodePembebanan: string;
  attachment?: string | null;
  budgetQtyBalance: number;
  budgetAmountBalance: number;
  currencyRate: number;
  status: string;
  items: ItemOfPurchaseRequest[];

  // save file
  attachmentFile?: File[] | null;
};

export type PurchaseRequestDetail = PurchaseRequest & {
  assetGroup: AssetGroup;
  budgetReference: BudgetReference;
  description: string;
  deliveryInstruction: string;
  prDate: string;
  dateRequired: string;
  districtCode: string;
  departmentCode: string;
  deliveryPoint: string;
  coa: string;
  warehouse: string;
  currency: string;
  purchaser: string;
  paymentInstruction: string;
  authorizedBy: string;
  materialGroup: string;
  picAsset: string;
  warrantyHoldPayment: string;
  uom: string;
  districtCodePembebanan: string;
  attachment: string;
  budgetQtyBalance: number;
  budgetAmountBalance: number;
  currencyRate: number;
  items: ItemOfPurchaseRequest[];
};

export type ItemOfPurchaseRequest = {
  id: string;
  item: string;
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  partNo: string;
  mnemonic: string;
  uom: string;
  quantity: number;
  priceUsd: number;
};
