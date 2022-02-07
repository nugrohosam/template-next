import React from 'react';
import { Col } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';

interface TimelineProps {
  size: number;
  tooltip?: string;
}

const Timeline: React.FC<TimelineProps> = ({ size, tooltip }) => {
  const colSize = size > 12 ? 1 : size;

  return (
    <Col>
      <div className="horizontal timeline" data-tip={tooltip}>
        <ReactTooltip multiline />
        <div className="steps">
          <div className="step" />
        </div>
      </div>
    </Col>
  );
};

export default Timeline;
