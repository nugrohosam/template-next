import { SelectOption } from 'components/form/SingleSelect';

export enum Currency {
  Idr = 'IDR',
  Usd = 'USD',
}

export const currencyOptions: SelectOption[] = [
  { label: 'IDR', value: Currency.Idr },
  { label: 'USD', value: Currency.Usd },
];
