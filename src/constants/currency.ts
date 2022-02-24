import { SelectOption } from 'components/form/SingleSelect';

export enum Currency {
  IDR = 'IDR',
  USD = 'USD',
}

export const currencyOptions: SelectOption[] = [
  { label: 'IDR', value: Currency.IDR },
  { label: 'USD', value: Currency.USD },
];
