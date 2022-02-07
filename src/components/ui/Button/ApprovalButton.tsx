import { Approval } from 'modules/approval/entities';
import React from 'react';
import { ButtonGroup } from 'react-bootstrap';

import ApproveModal from '../Modal/ApproveModal';
import RejectModal from '../Modal/RejectModal';
import ReviseModal from '../Modal/ReviseModal';

interface ApprovalButtonProps {
  onSend: (data: Approval) => void;
  reviseClassButton?: string;
  rejectClassButton?: string;
  approveClassButton?: string;
}

const ApprovalButton: React.FC<ApprovalButtonProps> = ({
  onSend,
  reviseClassButton,
  rejectClassButton,
  approveClassButton,
}) => {
  return (
    <ButtonGroup>
      <ReviseModal onSend={onSend} classButton={reviseClassButton} />
      <RejectModal onSend={onSend} classButton={rejectClassButton} />
      <ApproveModal onSend={onSend} classButton={approveClassButton} />
    </ButtonGroup>
  );
};

export default ApprovalButton;
