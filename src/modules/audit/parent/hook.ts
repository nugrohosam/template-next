import { Paginate, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchAudits } from './api';
import { Audit, AuditPaginateParams } from './entities';

export const useFetchAudits = (
  params: AuditPaginateParams
): UseQueryResult<Paginate<Audit>, ResponseError> => {
  return useQuery(['audits', params], () => fetchAudits(params));
};
