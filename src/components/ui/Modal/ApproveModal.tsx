import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import ModalBox from 'components/ui/Modal';
import {
  Approval,
  ApprovalField,
  ApprovalStatus,
} from 'modules/approval/entities';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface ApproveModalProps {
  onSend: (data: ApprovalField) => void;
  classButton?: string;
}

const ApproveModal: React.FC<ApproveModalProps> = ({ onSend, classButton }) => {
  const schema = yup.object().shape({
    status: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApprovalField>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  return (
    <ModalBox
      buttonTitle="Approve"
      buttonVariant="green"
      classButton={classButton}
      title="Are you sure to processed this data ?"
      onSend={handleSubmit(onSend)}
    >
      <Form>
        <Row>
          <Col lg={12}>
            <Input
              name="status"
              control={control}
              defaultValue={ApprovalStatus.Approve}
              disabled
              type="hidden"
              error={errors.status?.message}
            />
          </Col>
        </Row>
      </Form>
    </ModalBox>
  );
};

export default ApproveModal;
