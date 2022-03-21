import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import SingleSelect from 'components/form/SingleSelect';
import ModalBox from 'components/ui/Modal';
import { Currency } from 'constants/currency';
import { InterveneData, InterveneField } from 'modules/summary/entities';
import React, { useEffect } from 'react';
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { formatMoney } from 'utils/helpers';
import * as yup from 'yup';

interface InterveneModalProps {
  onSend: (data: InterveneField) => void;
  classButton?: string;
  interveneData: InterveneData;
}

const InterveneModal: React.FC<InterveneModalProps> = ({
  onSend,
  classButton,
  interveneData,
}) => {
  const schema = yup.object().shape({
    remark: yup.string().required(`Remark can't be empty!`),
    intervene: yup
      .number()
      .typeError(`Value can't be empty!`)
      .required(`Value can't be empty!`),
    type: yup.string().required(),
    amountLimitation: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<InterveneField>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      amountLimitation: 0,
    },
  });

  const handleSubmitForm = (data: InterveneField) => {
    onSend(data);
    reset({});
  };

  const watchForm = watch();
  useEffect(() => {
    if (watchForm.intervene) {
      if (watchForm.type === 'PERCENTAGE') {
        const percentageValue =
          interveneData.totalAmount * (watchForm.intervene / 100);
        setValue(
          'amountLimitation',
          interveneData.totalAmount - percentageValue
        );
      } else {
        setValue(
          'amountLimitation',
          interveneData.totalAmount - watchForm.intervene
        );
      }
    }
  }, [
    interveneData.totalAmount,
    setValue,
    watchForm.intervene,
    watchForm.type,
  ]);

  const modalTitle = interveneData.districtCode
    ? interveneData.districtCode
    : '(All District)';

  return (
    <ModalBox
      buttonTitle="Intervene"
      buttonVariant="orange"
      classButton={classButton}
      title={`Intervene ${modalTitle}`}
      onSend={handleSubmit(handleSubmitForm)}
      isError={!isValid}
    >
      <Form>
        <Row>
          {interveneData.districtCode && (
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">District</FormLabel>
                <Input
                  name="districtCode"
                  control={control}
                  type="text"
                  defaultValue={interveneData.districtCode}
                  disabled
                />
              </FormGroup>
            </Col>
          )}
          <Col lg={6}>
            <FormGroup>
              <FormLabel className="required">Total Amount</FormLabel>
              <FormControl
                type="text"
                value={formatMoney(interveneData.totalAmount, Currency.Idr)}
                disabled
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <FormLabel className="required">Type</FormLabel>
              <SingleSelect
                name="type"
                control={control}
                defaultValue="PERCENTAGE"
                placeholder="Type"
                options={[
                  { label: 'PERCENTAGE', value: 'PERCENTAGE' },
                  { label: 'AMOUNT', value: 'AMOUNT' },
                ]}
              />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <FormLabel className="required">Value</FormLabel>
              <Input
                name="intervene"
                control={control}
                placeholder="Value"
                type="number"
                defaultValue=""
                error={errors.intervene?.message}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <FormLabel className="required">
                Total Amount After Intervene
              </FormLabel>
              <FormControl
                type="text"
                value={formatMoney(watch('amountLimitation'), Currency.Idr)}
                disabled
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <FormGroup>
              <FormLabel className="required">Remark</FormLabel>
              <Input
                as="textarea"
                name="remark"
                control={control}
                placeholder="Enter a remark"
                type="text"
                defaultValue=""
                error={errors.remark?.message}
              />
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </ModalBox>
  );
};

export default InterveneModal;
