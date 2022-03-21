import { SelectOption } from 'components/form/SingleSelect';

import { NoiDivisionPaginateParams } from './api';
import { useFetchNoiDivision } from './hook';

export const useNoiDivisionOptions = (params: NoiDivisionPaginateParams) => {
  const dataHookNoiDivisions = useFetchNoiDivision({ pageSize: 50, ...params });
  const noiDivisionOptions: SelectOption[] =
    dataHookNoiDivisions.data?.items.map((item) => ({
      value: item.deptNfs,
      label: item.deptNfs,
    })) || [];

  return { dataHookNoiDivisions, noiDivisionOptions };
};
