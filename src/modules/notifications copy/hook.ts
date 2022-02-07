import { Paginate, PaginateParams, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchNotifications } from './api';
import type { Notification } from './entities';

export const useFetchNotifications = (
  params: PaginateParams
): UseQueryResult<Paginate<Notification>, ResponseError> => {
  return useQuery(['notifications', params], () => fetchNotifications(params));
};
