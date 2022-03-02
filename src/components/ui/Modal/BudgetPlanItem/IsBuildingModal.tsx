import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import SingleSelect, { SelectOption } from 'components/form/SingleSelect';
import { Currency, currencyOptions } from 'constants/currency';
import { useFetchAssetGroups } from 'modules/assetGroup/hook';
import {
  ItemOfBudgetPlanItem,
  ItemOfBudgetPlanItemForm,
} from 'modules/budgetPlanItem/entities';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import * as yup from 'yup';

import SimpleTable from '../../Table/SimpleTable';
import ModalBox from '..';

interface IsBuildingBudgetPlanItemModalProps {
  onSend: (data: ItemOfBudgetPlanItemForm) => void;
  classButton?: string;
  buttonTitle?: string;
}

const initDefaultValues = () => ({
  idAssetGroup: '',
  currency: null,
  detail: '',
  pricePerUnit: null,
  idCapexCatalog: null,
  // TODO: currenctRate masih dummy
  currencyRate: 10000,
  items: [...Array(12).keys()].map((item) => ({
    month: item + 1,
    quantity: 0,
  })),
});

const IsBuildingBudgetPlanItemModal: React.FC<
  IsBuildingBudgetPlanItemModalProps
> = ({ onSend, classButton, buttonTitle = '+ Add Item' }) => {
  const schema = yup.object().shape({
    idAssetGroup: yup.string().required(),
    currency: yup.string().required(),
    detail: yup.string().required().nullable(),
  });

  const [kurs, setKurs] = useState<number>(14500);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    resetField,
    reset,
  } = useForm<ItemOfBudgetPlanItemForm>({
    shouldUnregister: false,
    mode: 'onChange',
    resolver: yupResolver(schema),
    delayError: 500,
    defaultValues: initDefaultValues(),
  });
  const { fields } = useFieldArray({
    control,
    name: 'items',
  });
  const watchCurrency = watch('currency');
  const watchItems = watch('items');

  const handleSubmitForm = (data: ItemOfBudgetPlanItemForm) => {
    data.totalAmount = +totalAmount();
    data.totalAmountUsd = +totalAmountUsd();

    console.log(data);
    data.items = data.items
      .map((item) => ({ ...item, amount: +item.amount }))
      .filter((item) => item.amount);
    onSend(data);
    reset(initDefaultValues());
  };

  // asset group options
  const dataHookAssetGroups = useFetchAssetGroups({ pageSize: 50 });
  const assetGroupOptions: SelectOption[] =
    dataHookAssetGroups.data?.items
      .filter((item) => item.assetGroupCode === 'BG')
      .map((item) => ({
        value: item.id,
        label: item.assetGroup,
      })) || [];

  const columns = useMemo<Column<ItemOfBudgetPlanItem>[]>(
    () => [
      {
        Header: 'Month',
        accessor: 'month',
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItem>) =>
          moment()
            .month(row.values.month - 1)
            .format('MMMM'),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItem>) => (
          <Input
            name={`items.${row.index}.amount`}
            control={control}
            defaultValue=""
            type="number"
            placeholder="Amount"
            error={
              (errors.items?.length &&
                errors.items[row.index].amount?.message) ||
              ''
            }
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [control, errors.items, watchItems]
  );

  const totalAmount = () => {
    if (!watchCurrency) return 0;
    const total = watchItems
      .map((item) => +item.amount)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    return watchCurrency === Currency.USD ? total * kurs : total;
  };

  const totalAmountUsd = () => {
    if (!watchCurrency) return 0;
    const total = watchItems
      .map((item) => +item.amount)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    return watchCurrency === Currency.IDR ? total / kurs : total;
  };

  return (
    <ModalBox
      buttonTitle={buttonTitle}
      buttonVariant="primary"
      submitButtonVariant="primary"
      classButton={classButton}
      title="Add Budget Plan Item"
      wordingSubmit="Save"
      dialogClassName="modal-90w"
      onSend={handleSubmit(handleSubmitForm)}
    >
      <Row>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Kurs</FormLabel>
            <FormControl type="text" value={kurs} disabled />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Asset Group</FormLabel>
            <SingleSelect
              name="idAssetGroup"
              control={control}
              placeholder="Asset Group"
              options={assetGroupOptions}
              error={errors.idAssetGroup?.message}
              onChange={() => resetField('currency')}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Currency</FormLabel>
            <SingleSelect
              name="currency"
              control={control}
              placeholder="Currency"
              options={currencyOptions}
              error={errors.currency?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={12}>
          <FormGroup>
            <FormLabel className="required">Detail</FormLabel>
            <Input
              name="detail"
              control={control}
              defaultValue=""
              type="text"
              placeholder="Detail"
              error={errors.detail?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Total IDR</FormLabel>
            <FormControl
              type="text"
              value={totalAmount().toLocaleString('id-Id')}
              disabled
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Total USD</FormLabel>
            <FormControl
              type="text"
              value={totalAmountUsd().toLocaleString('en-En')}
              disabled
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <SimpleTable
          classTable="table-admin table-inherit"
          columns={columns}
          items={fields}
        />
      </Row>
    </ModalBox>
  );
};

export default IsBuildingBudgetPlanItemModal;
