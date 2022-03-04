import { Paginate, ResponseError } from 'modules/common/types';
import { useQuery, UseQueryResult } from 'react-query';

import { fetchNotifications, FetchNotifParams } from './api';
import type { Notification } from './entities';

export const useFetchNotifications = (
  params: FetchNotifParams
): UseQueryResult<Paginate<Notification>, ResponseError> => {
  return useQuery(['notifications', params], () => fetchNotifications(params));
};
