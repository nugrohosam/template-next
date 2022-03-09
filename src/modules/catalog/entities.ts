import { Currency } from 'constants/currency';
import type { AssetGroup } from 'modules/assetGroup/entities';

export type Catalog = {
  id: string;
  detail: string;
  primaryCurrency: Currency;
  priceInIdr: number;
  priceInUsd: number;
  status: string;
  createdAt: string;
  assetGroup: AssetGroup;
};

export interface CatalogForm {
  detail: string;
  primaryCurrency: string;
  priceInIdr: number;
  priceInUsd: number;
  assetGroupId: string;
}

export interface UploadCatalogReq {
  file: Array<File>;
}
