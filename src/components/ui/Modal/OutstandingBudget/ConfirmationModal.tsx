import { yupResolver } from '@hookform/resolvers/yup';
import SingleSelect from 'components/form/SingleSelect';
import { outstandingAdjustmentCurrentPeriodOptions } from 'constants/adjustmentCurrentPeriod';
import {
  confirmOutstandingBudget,
  confirmOutstandingBudgetField,
} from 'modules/outstandingBudget/entities';
import React, { useEffect, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Input from '../../../form/Input';
import ModalBox from '../';

interface ConfirmationModalProps {
  onSend: (data: confirmOutstandingBudget) => void;
  classButton?: string;
  confirmData: confirmOutstandingBudgetField;
}

const ConfirmModal: React.FC<ConfirmationModalProps> = ({
  onSend,
  classButton,
  confirmData,
}) => {
  const schema = yup.object().shape({
    adjustmentCurrentPeriod: yup.string().required('Required field'),
    adjustedSisaBudgetUsdS1CurrentPeriod: yup.number().required(),
    adjustedRealisasiSisaBudgetS1CurrentPeriod: yup.number().required(),
    adjustmentRemark: yup.string().required('Required field'),
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<confirmOutstandingBudget>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const options = outstandingAdjustmentCurrentPeriodOptions;

  const [amountAdjustment, setAmountAdjustment] = useState(0);
  const [amountBudget, setAmountBudget] = useState(0);

  const [refreshAdjusted, setRefreshAdjusted] = useState(0);

  useEffect(() => {
    setValue(
      'adjustedSisaBudgetUsdS1CurrentPeriod',
      (confirmData.totalPengajuanBudgetUsdS1CurrentPeriod /
        confirmData.originalQuantity) *
        confirmData.adjustedLeftInformation
    );
    setAmountBudget(
      (confirmData.totalPengajuanBudgetUsdS1CurrentPeriod /
        confirmData.originalQuantity) *
        confirmData.adjustedLeftInformation
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshAdjusted]);

  const handleAdjustmentChange = (value: string | number | boolean) => {
    if (value !== '0') {
      setValue(
        'adjustedRealisasiSisaBudgetS1CurrentPeriod',
        confirmData.adjustedSisaBudgetUsdS1CurrentPeriod *
          confirmData.realisasiSisaBudgetS1CurrentPeriod
      );
    } else {
      setValue('adjustedRealisasiSisaBudgetS1CurrentPeriod', 0);
      setAmountAdjustment(0);
    }
  };

  const handleSubmitForm = (data: confirmOutstandingBudget) => {
    onSend(data);
    reset();
  };

  return (
    <ModalBox
      buttonTitle="Confirmation"
      buttonVariant="primary"
      submitButtonVariant="primary"
      classButton={classButton}
      title="Confirm Oustanding Budgets"
      onSend={handleSubmit(handleSubmitForm)}
      onClikModal={() => setRefreshAdjusted((prevValue) => prevValue + 1)}
    >
      <Row>
        <Col lg={12}>
          <FormGroup>
            <FormLabel>Adjustment Current Period</FormLabel>
            <SingleSelect
              name="adjustmentCurrentPeriod"
              defaultValue="0"
              control={control}
              placeholder="Adjustment Current Period"
              options={options}
              onChange={(e) => handleAdjustmentChange(e.value)}
            />
          </FormGroup>
        </Col>
        <Col lg={12}>
          <FormGroup>
            <FormLabel>Adjusted Sisa Budget (USD) S1 Current Period</FormLabel>
            <Input
              name="adjustedSisaBudgetUsdS1CurrentPeriod"
              control={control}
              disabled
              type="number"
              defaultValue="0"
              placeholder="Adjusted Sisa Budget (USD) S1 Current Period"
              error={errors.adjustedSisaBudgetUsdS1CurrentPeriod?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={12}>
          <FormGroup>
            <FormLabel>
              Adjusted Realisasi Sisa Budget S1 Current Period
            </FormLabel>
            <Input
              name="adjustedRealisasiSisaBudgetS1CurrentPeriod"
              control={control}
              disabled
              type="number"
              defaultValue="0"
              placeholder="Adjusted Realisasi Sisa Budget S1 Current Period"
              error={errors.adjustedRealisasiSisaBudgetS1CurrentPeriod?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={12}>
          <FormGroup>
            <FormLabel>Remark</FormLabel>
            <Input
              as="textarea"
              name="adjustmentRemark"
              control={control}
              placeholder="Enter a remark"
              type="text"
              error={errors.adjustmentRemark?.message}
            />
            <Input
              name="idOutstandingBudgets"
              control={control}
              type="hidden"
              defaultValue={confirmData.idOutstandingBudgets}
              disabled
            />
          </FormGroup>
        </Col>
      </Row>
    </ModalBox>
  );
};

export default ConfirmModal;
