import { SelectOption } from 'components/form/SingleSelect';

export const useGroupedDistrictOptions = () => {
  const pamaMiningOptions: SelectOption[] = [
    { label: 'ABKL', value: 'ABKL' },
    { label: 'BRCB', value: 'BRCB' },
    { label: 'ARIA', value: 'ARIA' },
    { label: 'BAYA', value: 'BAYA' },
    { label: 'ADRO', value: 'ADRO' },
    { label: 'KPRT', value: 'KPRT' },
    { label: 'KIDE', value: 'KIDE' },
    { label: 'INDO', value: 'INDO' },
    { label: 'KPCS', value: 'KPCS' },
    { label: 'ASMI', value: 'ASMI' },
    { label: 'BEKB', value: 'BEKB' },
    { label: 'TOPB', value: 'TOPB' },
    { label: 'TCMM', value: 'TCMM' },
    { label: 'MTBU', value: 'MTBU' },
    { label: 'SMMS', value: 'SMMS' },
    { label: 'KPCB', value: 'KPCB' },
    { label: 'BHPL', value: 'BHPL' },
    { label: 'SJRP', value: 'SJRP' },
    { label: 'BCSK', value: 'BCSK' },
  ];

  const pamaOthersOptions: SelectOption[] = [
    { label: 'JIEP', value: 'JIEP' },
    { label: 'BPOP', value: 'BPOP' },
    { label: 'PPIC', value: 'PPIC' },
    { label: 'BBSO', value: 'BBSO' },
    { label: 'CUTB', value: 'CUTB' },
    { label: 'PIKO', value: 'PIKO' },
    { label: 'ERKA', value: 'ERKA' },
  ];

  interface GroupedOptions {
    label: string;
    options: SelectOption[];
    value?: string;
  }

  const groupedDistrictOptions: GroupedOptions[] = [
    { label: 'PAMA MINING', options: pamaMiningOptions },
    { label: 'PAMA OTHERS', options: pamaOthersOptions },
  ];

  return groupedDistrictOptions;
};
