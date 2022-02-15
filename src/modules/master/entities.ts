export type ExpenseElement = {
  districtCode: string;
  expElement: string;
  expElementDescription: string;
};

export type District = {
  id: string;
  address: string;
  area: string;
  autoApproveHc: boolean;
  code: string;
  districtName: string;
  group: string;
  status: string;
  createdAt: string;
};

export type Department = {
  districtCode: string;
  deptCode: string;
  deptNfs: string;
  divisiNfs: string;
};
