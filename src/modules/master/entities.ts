import { RequiredBooleanSchema } from 'yup/lib/boolean';

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

export type DeliveryPoint = {
  deliveryPointId: string;
  description: string;
  isActive: boolean;
};

export type Warehouse = {
  warehouseId: string;
  description: string;
};

export type MaterialGroup = {
  materialGroupCodeId: string;
  description: string;
  isActive: boolean;
};

export type Uom = {
  uomCode: number;
  uomDescription: string;
};

export type Employee = {
  id: number;
  nrp: string;
  accountDomain: string;
  name: string;
};

export type Supplier = Pick<Employee, 'id' | 'name'>;

export type Mnemonic = {
  mnemonicId: string;
  description: string;
};
