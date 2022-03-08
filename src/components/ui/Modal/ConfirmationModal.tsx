import { yupResolver } from '@hookform/resolvers/yup';
import SingleSelect from 'components/form/SingleSelect';
import { adjustmentCurrentPeriodOptions } from 'constants/adjustmentCurrentPeriod';
import {
  ConfirmationField,
  OutstandingPrPoConfirmation,
} from 'modules/outstandingprpo/entities';
import { Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Input from '../../form/Input';
import ModalBox from '.';

interface ConfirmationModalProps {
  onSend: (data: OutstandingPrPoConfirmation) => void;
  confirmData: ConfirmationField;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onSend,
  confirmData,
}) => {
  const schema = yup.object().shape({
    adjustmentCurrentPeriod: yup.string().required(),
    amountAdjustment: yup.string().required(),
    remark: yup.string().required(`Remark can't be empty!`),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<OutstandingPrPoConfirmation>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      amountAdjustment: 0,
    },
  });

  const options = adjustmentCurrentPeriodOptions;

  const handleAdjustmentChange = (value: string | number | boolean) => {
    if (value !== '0') {
      setValue('amountAdjustment', confirmData.amountAdjustment);
    } else {
      setValue('amountAdjustment', 0);
    }
  };

  return (
    <ModalBox
      buttonTitle="Confirm"
      title="Confirmation"
      onSend={handleSubmit(onSend)}
      isError={!isValid}
    >
      <Form>
        <Row>
          <Col lg={6} className="required">
            Adjustment Current Period
          </Col>
          <Col lg={6}>
            <SingleSelect
              name="adjustmentCurrentPeriod"
              defaultValue="0"
              control={control}
              placeholder="Adjustment Current Period"
              options={options}
              onChange={(e) => handleAdjustmentChange(e.value)}
            />
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={6} className="required">
            Amount Adjustment
          </Col>
          <Col lg={6}>
            <Input
              name="amountAdjustment"
              control={control}
              type="number"
              defaultValue="0"
              disabled
            />
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={6} className="required">
            Remark
          </Col>
          <Col lg={6}>
            <Input
              as="textarea"
              name="remark"
              control={control}
              placeholder="Enter a remark"
              type="text"
              defaultValue=""
              error={errors.remark?.message}
            />
            <Input
              name="idOutstandingPrPo"
              control={control}
              type="hidden"
              defaultValue={confirmData.idOutstandingPrPo}
              disabled
            />
          </Col>
        </Row>
      </Form>
    </ModalBox>
  );
};

export default ConfirmationModal;
