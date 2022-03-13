import { SelectOption } from 'components/form/SingleSelect';

import { FetchUsersParams } from './api';
import { useFetchUsers } from './hook';

export const useUserOptions = (params: FetchUsersParams) => {
  const dataHookUsers = useFetchUsers({ pageSize: 50, ...params });
  const userOptions: SelectOption[] =
    dataHookUsers.data?.items.map((item) => ({
      value: item.nrp,
      label: `${item.nrp} - ${item.name}`,
    })) || [];

  return { dataHookUsers, userOptions };
};
