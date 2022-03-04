import ContentLayout from 'components/ui/ContentLayout';
import { Paginate } from 'modules/common/types';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import {
  fetchNotifications,
  readNotifications,
} from 'modules/notifications/api';
import { Notification } from 'modules/notifications/entities';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';

const Notifications: NextPage = () => {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Paginate<Notification>>();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [profile] = useDecodeToken();

  const scrollNotifications = () => {
    if ((notifications?.paging.totalItems as number) > (pageSize as number)) {
      fetchNotifications({ userId: profile?.id, pageSize: 10 }).then(
        (response) => {
          setPageSize((prevState) => (prevState as number) + 10);
          setNotifications(response);
        }
      );
    } else {
      setHasMore(false);
    }
  };

  const readNotification = (notification: Notification) => {
    readNotifications(notification.id).then(() => {
      if (notification.resourceType === 'budget_plan_item_group') {
        router.push(`/budget-plans/${notification.resourceId}`);
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchNotifications({ userId: profile?.id, pageSize: 10 })
      .then((response) => {
        setPageSize(10);
        setNotifications(response);
        setLoading(false);
        if (response.items.length === 0) {
          setHasMore(false);
        }
      })
      .catch(() => {
        setLoading(false);
        setHasMore(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <ContentLayout>
      <Col lg={{ span: 6, offset: 3 }}>
        <Row className="notification__row--text">
          <Col lg={12}>
            <span className="notification__title">Notifications</span>
          </Col>
        </Row>
        <InfiniteScroll
          dataLength={(notifications?.items.length as number) || 0}
          next={scrollNotifications}
          hasMore={hasMore}
          style={{ overflowX: 'hidden' }}
          endMessage={<></>}
          loader={
            <Row className="notification__row--card">
              <Col lg={12}>
                <div className="notification__card justify-content-center align-items-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              </Col>
            </Row>
          }
        >
          {!loading &&
            notifications &&
            notifications.items.length !== 0 &&
            notifications.items.map((item, index) => (
              <Row className="notification__row--card" key={index}>
                <Col
                  lg={12}
                  className="cursor-pointer"
                  onClick={() => readNotification(item)}
                >
                  <div
                    className={`notification__card ${
                      !item.read && 'notification__card--unread'
                    }`}
                  >
                    <h5 className="card__title text-capitalize">
                      {item.title}
                    </h5>
                    <span className="card__text">{item.content}</span>
                  </div>
                </Col>
              </Row>
            ))}
        </InfiniteScroll>
        {!loading && (notifications?.items.length === 0 || !notifications) && (
          <Row className="notification__row--card">
            <Col lg={12}>
              <div className="notification__card text-center">
                <span>No notifications</span>
              </div>
            </Col>
          </Row>
        )}
      </Col>
    </ContentLayout>
  );
};

export default Notifications;
