import Panel from 'components/form/Panel';
import TimeLine from 'components/ui/Timeline';
import { Audit } from 'modules/audit/parent/entities';
import { Paginate } from 'modules/common/types';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { formatTime, parseUndescoreString } from 'utils/helpers';

interface AuditTimelineProps {
  audit: Paginate<Audit> | undefined;
}

const AuditTimeline: React.FC<AuditTimelineProps> = ({ audit }) => {
  const auditLength = audit?.items.length || 0;
  const lastIndex = (audit?.items.length || 1) - 1;

  const getTooltip = (item: Audit) => {
    const tooltip = `Status:  ${parseUndescoreString(item.statusTo)} by ${
      item.userName
    } <br /> Date : ${formatTime(item.createdAt)}`;

    return tooltip;
  };

  const getCurrentStatus = (item: Audit) => {
    const currentStatus = `${parseUndescoreString(item.statusTo)} By ${
      item.userName
    }`;

    return currentStatus;
  };

  return (
    <div className="mt-3">
      <Panel>
        <Row>
          {audit?.items.map((item, index) => {
            return (
              <div key={index} style={{ display: 'contents' }}>
                {index === 0 && (
                  <Col lg={12}>
                    <div>
                      <p className="profile-detail__info--title mb-1">
                        Current Status
                      </p>
                      <p className="profile-detail__info--title font-weight-bold text- mb-1">
                        {getCurrentStatus(audit.items[lastIndex])}
                      </p>
                      <p className="profile-detail__info--title mb-1">
                        {audit?.items[lastIndex].createdAt}
                      </p>
                    </div>
                  </Col>
                )}
                <TimeLine
                  key={item.id}
                  size={auditLength}
                  tooltip={getTooltip(item)}
                ></TimeLine>
              </div>
            );
          })}
        </Row>
      </Panel>
    </div>
  );
};

export default AuditTimeline;
