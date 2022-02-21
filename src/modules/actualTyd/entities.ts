export type ActualYtd = {
  id: string;
  district: string;
  assetGroup: string;
  amount: number;
  year: number;
  period: string;
  createdAt: string;
};

export interface UploadActualYtdReq {
  file: Array<File>;
  year: string;
  period: string;
}
