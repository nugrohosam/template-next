import { yupResolver } from '@hookform/resolvers/yup';
import { ApprovalField, ApprovalStatus } from 'modules/approval/entities';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Input from '../../form/Input';
import ModalBox from '.';

interface ReviseModalProps {
  onSend: (data: ApprovalField) => void;
  classButton?: string;
}

const ReviseModal: React.FC<ReviseModalProps> = ({ onSend, classButton }) => {
  const schema = yup.object().shape({
    notes: yup.string().required('Required field'),
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
      buttonTitle="Revise"
      buttonVariant="orange"
      submitButtonVariant="red"
      classButton={classButton}
      title="Are you sure to processed this data ?"
      onSend={handleSubmit(onSend)}
    >
      <p className="text-center">Enter a remark</p>
      <Form>
        <Row>
          <Col lg={12}>
            <Input
              as="textarea"
              name="notes"
              control={control}
              placeholder="Enter a remark"
              type="text"
              error={errors.notes?.message}
            />
            <Input
              name="status"
              control={control}
              defaultValue={ApprovalStatus.REVISE}
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

export default ReviseModal;
