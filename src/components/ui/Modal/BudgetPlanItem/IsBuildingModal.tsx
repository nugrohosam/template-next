import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import SingleSelect from 'components/form/SingleSelect';
import { Currency, currencyOptions } from 'constants/currency';
import { useAssetGroupOptions } from 'modules/assetGroup/helpers';
import {
  BudgetPlanItemOfBudgetPlanItemForm,
  ItemOfBudgetPlanItem,
} from 'modules/budgetPlanItem/entities';
import { useKurs } from 'modules/custom/useKurs';
import moment from 'moment';
import React, { useMemo } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import * as yup from 'yup';

import SimpleTable from '../../Table/SimpleTable';
import ModalBox from '..';
import { BudgetPlanItemModalProps } from './BudgetPlanItemModal';

const initItems = () =>
  [...Array(12).keys()].map((item) => ({
    month: item + 1,
    quantity: 0,
  }));
const initDefaultValues = () => ({
  idAssetGroup: '',
  currency: null,
  detail: '',
  pricePerUnit: 0,
  idCapexCatalog: null,
  currencyRate: 10000, // TODO: currenctRate masih dummy
  items: initItems(),
});

const schema = yup.object().shape({
  idAssetGroup: yup.string().required(),
  currency: yup.string().required().nullable(),
  detail: yup.string().required().nullable(),
});

const IsBuildingBudgetPlanItemModal: React.FC<BudgetPlanItemModalProps> = ({
  onSend,
  classButton,
  buttonTitle,
  isEdit,
  myItem,
}) => {
  /**
   * Handle form
   */
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<BudgetPlanItemOfBudgetPlanItemForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    delayError: 500,
    defaultValues: initDefaultValues(),
  });
  const { fields } = useFieldArray({
    control,
    name: 'items',
  });
  const { currency: watchCurrency, items: watchItems } = watch();

  const handleSubmitForm = (data: BudgetPlanItemOfBudgetPlanItemForm) => {
    data.items = watchItems
      .filter((item) => item.amount)
      .map((item) => ({
        month: item.month,
        quantity: item.quantity,
        amount: +item.amount || 0,
      }));
    data.totalAmount = totalAmount(Currency.IDR);
    data.totalAmountUsd = totalAmount(Currency.USD);

    onSend(data);
    reset(initDefaultValues());
  };
  // --------------- //

  const { kurs } = useKurs();
  const assetGroupOptions = useAssetGroupOptions().filter(
    (item) => item.label === 'Building'
  );

  const totalAmount = (currency: Currency) => {
    if (!watchCurrency) return 0;
    const total = watchItems
      .filter((item) => item.amount)
      .map((item) => +item.amount)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    if (currency === Currency.USD) {
      return watchCurrency === Currency.IDR ? total / kurs : total;
    } else if (currency === Currency.IDR) {
      return watchCurrency === Currency.USD ? total * kurs : total;
    }

    return 0;
  };

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
    [control, errors.items]
  );

  const onModalOpened = () => {
    if (isEdit) {
      reset({
        idAssetGroup: myItem?.idAssetGroup,
        pricePerUnit: myItem?.pricePerUnit,
        currency: myItem?.currency,
        currencyRate: myItem?.currencyRate,
        id: myItem?.id,
        detail: myItem?.detail,
        items:
          initItems().map((prev) => {
            const foundMonth = myItem?.items.find(
              (item) => item.month === prev.month
            );
            return foundMonth || prev;
          }) || [],
      });
    }
  };

  return (
    <ModalBox
      buttonTitle={buttonTitle || ''}
      buttonVariant="primary"
      submitButtonVariant="primary"
      classButton={classButton}
      title="Add Budget Plan Item"
      wordingSubmit="Save"
      dialogClassName="modal-90w"
      onSend={handleSubmit(handleSubmitForm)}
      onClikModal={onModalOpened}
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
              defaultValue=""
              placeholder="Asset Group"
              options={assetGroupOptions}
              error={errors.idAssetGroup?.message}
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
              value={totalAmount(Currency.IDR).toLocaleString('id-Id')}
              disabled
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Total USD</FormLabel>
            <FormControl
              type="text"
              value={totalAmount(Currency.USD).toLocaleString('en-EN')}
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
