export type AssetGroup = {
  id: string;
  assetGroup: string;
  assetGroupCode: string;
  pics: AssetGroupPics[];
  createdAt: string;
};

export type AssetGroupPics = {
  districtCode: string;
  departementCode: string;
  type: string;
  isBudgetCodeDefault: boolean;
};

export interface AssetGroupForm {
  assetGroup: string;
  assetGroupCode: string;
  pics?: AssetGroupPics[];
}
