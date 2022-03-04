import { Paginate, PaginateParams, ResponseData } from 'modules/common/types';
import axios from 'utils/axios';

import { Notification } from './entities';

export interface FetchNotifParams extends PaginateParams {
  userId?: string;
}

export const fetchNotifications = async (
  params: FetchNotifParams
): Promise<Paginate<Notification>> => {
  const result = await axios.get<ResponseData<Paginate<Notification>>>(
    `v1/notifications`,
    { params }
  );
  return result.data.data;
};

export const readNotifications = async (
  notifId: string
): Promise<Notification> => {
  const result = await axios.put(`v1/notifications/${notifId}`);
  return result.data.data;
};
