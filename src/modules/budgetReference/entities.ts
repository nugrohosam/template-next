import { Currency } from 'constants/currency';

export type BudgetReference = {
  id: string;
  budgetCode: string;
  districtCode: string;
  divisionCode: string;
  departmentCode: string;
  currency: Currency;
  balance: number;
  currentBalance: number;
  description: string;
  qty: number;
  pricePerUnit: number;
};
