import { Paginate, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { Audit, AuditPaginateParams } from './entities';

export const fetchAudits = async (
  params: AuditPaginateParams
): Promise<Paginate<Audit>> => {
  const result = await axios.get<ResponseData<Paginate<Audit>>>('v1/audits', {
    params,
  });
  return result.data.data;
};
