import { ResponseData } from 'modules/common/types';
import { Profile } from 'modules/profile/entities';
import axios from 'utils/axios';

import { Menu } from './entities';

export interface ManagementMenu extends Profile {
  management: Menu[];
}

export const fetchManagementMenu = async (): Promise<Menu[]> => {
  const result = await axios.get<ResponseData<ManagementMenu>>(
    'v1/mapping-menu'
  );
  return result.data.data.management;
};
