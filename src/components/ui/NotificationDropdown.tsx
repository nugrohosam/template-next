import { Paginate } from 'modules/common/types';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import {
  fetchNotifications,
  readNotifications,
} from 'modules/notifications/api';
import { Notification } from 'modules/notifications/entities';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UIEvent, useState } from 'react';
import { Dropdown, Nav, Spinner } from 'react-bootstrap';

const NotificationDropdown: React.FC = () => {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Paginate<Notification>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [profile] = useDecodeToken();

  const loadNotifications = () => {
    setLoading(true);
    fetchNotifications({ userId: profile?.id, pageSize: 10 })
      .then((response) => {
        setPageSize(10);
        setNotifications(response);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const scrollNotifications = (e: UIEvent<HTMLDivElement>) => {
    if ((notifications?.paging.totalItems as number) > (pageSize as number)) {
      if (
        Math.floor(e.currentTarget.scrollTop) + e.currentTarget.offsetHeight ===
        e.currentTarget.scrollHeight
      ) {
        fetchNotifications({
          userId: profile?.id,
          pageSize: pageSize + 10,
        }).then((response) => {
          setPageSize((prevState) => (prevState as number) + 10);
          setNotifications(response);
        });
      }
    }
  };

  const readNotification = (notification: Notification) => {
    readNotifications(notification.id).then(() => {
      if (notification.resourceType === 'budget_plan_item_group') {
        router.push(`/budget-plans/${notification.resourceId}`);
      } else if (notification.resourceType === 'unbudget') {
        router.push(`/unbudgets/${notification.resourceId}/detail`);
      } else if (notification.resourceType === 'overbudget') {
        router.push(`/overbudgets/${notification.resourceId}/detail`);
      }
    });
  };

  return (
    <Dropdown
      as={Nav.Item}
      className="d-flex pr-3 notification-admin empty"
      id="scroll-admin"
    >
      <Dropdown.Toggle as={Nav.Link}>
        <div
          className="position-relative padding-button"
          onClick={loadNotifications}
        >
          <Image
            src="/images/icons/ic_notification.svg"
            width={20}
            height={20}
            alt="Notification"
          />
          <span
            className={
              notifications &&
              notifications?.items.filter((item) => !item.read).length !== 0
                ? 'dot'
                : ''
            }
          ></span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu align="right">
        <Dropdown.Header>Notification</Dropdown.Header>
        {loading && (
          <Dropdown.Item>
            <div className="notification-item justify-content-center align-items-center">
              <Spinner animation="border" variant="primary" />
            </div>
          </Dropdown.Item>
        )}
        {!loading && notifications && notifications?.items.length !== 0 && (
          <>
            <div className="dropdown-wrapper" onScroll={scrollNotifications}>
              {notifications?.items.map((item, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => readNotification(item)}
                >
                  <div
                    className={`notification-item ${
                      !item.read && 'notification__card--unread'
                    }`}
                  >
                    <h5 className="text__blue notification-title">
                      {item.title}
                    </h5>
                    <span className="notification-text admin__data--text-black">
                      {item.content}
                    </span>
                  </div>
                </Dropdown.Item>
              ))}
            </div>
            <Dropdown.Header className="notification-all">
              <Link href="/notifications" passHref>
                See All Notifications
              </Link>
            </Dropdown.Header>
          </>
        )}
        {!loading && (notifications?.items.length === 0 || !notifications) && (
          <Dropdown.Item>
            <div className="notification-item">
              <span className="notification-text text-center">
                No Notifications
              </span>
            </div>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
