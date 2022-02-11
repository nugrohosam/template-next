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
};

export interface AssetGroupForm {
  assetGroup: string;
  assetGroupCode: string;
  pics?: AssetGroupPics[];
}
