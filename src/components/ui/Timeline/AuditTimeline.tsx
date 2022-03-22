import Panel from 'components/form/Panel';
import TimeLine from 'components/ui/Timeline';
import { AuditStatus } from 'modules/audit/parent/constant';
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

  const userNrp = (status: string) => {
    const statusNrp = [
      AuditStatus.Cancel,
      AuditStatus.Delete,
      AuditStatus.Reject,
      AuditStatus.Revise,
    ];
    return statusNrp.includes(status as AuditStatus);
  };

  const getTooltip = (item: Audit) => {
    const tooltip = `Status:  ${parseUndescoreString(item.statusTo)} ${
      userNrp(item.statusTo) ? `by ${item.userNrp}` : ''
    } <br /> Date : ${formatTime(item.createdAt)}`;

    return tooltip;
  };

  const getCurrentStatus = (item: Audit) => {
    const currentStatus = parseUndescoreString(item.statusTo);

    return currentStatus;
  };

  return (
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
  );
};

export default AuditTimeline;
