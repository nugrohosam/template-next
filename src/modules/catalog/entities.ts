import type { AssetGroup } from 'modules/assetGroup/entities';

export type Catalog = {
  id: string;
  detail: string;
  primaryCurrency: string;
  priceInIdr: number;
  priceInUsd: number;
  status: string;
  created_at: string;
  assetGroup: AssetGroup;
};

export interface CatalogForm {
  detail: string;
  primaryCurrency: string;
  priceInIdr: number;
  priceInUsd: number;
  assetGroupId: string;
}