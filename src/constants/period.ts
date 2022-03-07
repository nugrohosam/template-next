import { SelectOption } from 'components/form/SingleSelect';

export enum PeriodeType {
  Mb = 'MB',
  S2 = 'S2',
}
export const periodeTypeOptions: SelectOption[] = [
  { label: 'MB', value: PeriodeType.Mb },
  { label: 'S2', value: PeriodeType.S2 },
];

export const periodeStatusOptions: SelectOption[] = [
  { label: 'OPEN', value: 'OPEN' },
  { label: 'CLOSE', value: 'CLOSE' },
];

export const periodePositionOptions: SelectOption[] = [
  { label: 'FINAL', value: 'FINAL' },
  { label: 'UNFINAL', value: 'UNFINAL' },
];

export const periodeYearOptions: SelectOption[] = Array.from(
  {
    length: (new Date().getFullYear() + 10 - new Date().getFullYear()) / 1 + 1,
  },
  (_, i) => {
    return {
      label: String(new Date().getFullYear() + i * 1),
      value: +String(new Date().getFullYear() + i * 1),
    };
  }
);
