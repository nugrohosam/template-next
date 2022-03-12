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
