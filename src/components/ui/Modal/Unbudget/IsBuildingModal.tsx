import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import SingleSelect from 'components/form/SingleSelect';
import { Currency, currencyOptions } from 'constants/currency';
import { PeriodeType } from 'constants/period';
import { useAssetGroupOptions } from 'modules/assetGroup/helpers';
import { useCurrencyRate } from 'modules/custom/useCurrencyRate';
import {
  BudgetPlanItemOfUnbudgetForm,
  ItemOfUnbudgetItem,
} from 'modules/unbudget/entities';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import { formatMoney } from 'utils/helpers';
import * as yup from 'yup';

import SimpleTable from '../../Table/SimpleTable';
import ModalBox from '..';
import { UnbudgetModalProps } from './UnbudgetModal';

const initDefaultValues = () => ({
  idAssetGroup: '',
  currency: null,
  detail: '',
  pricePerUnit: 0,
  idCapexCatalog: null,
  currencyRate: 10000, // TODO: currenctRate masih dummy
  items: [...Array(12).keys()].map((item) => ({
    month: item + 1,
    quantity: 0,
  })),
});

const schema = yup.object().shape({
  idAssetGroup: yup.string().required(),
  currency: yup.string().required().nullable(),
  detail: yup.string().required().nullable(),
});

const IsBuildingUnbudgetModal: React.FC<UnbudgetModalProps> = ({
  onSend,
  classButton,
  buttonTitle,
  period,
}) => {
  /**
   * Handle form
   */
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    reset,
    setValue,
  } = useForm<BudgetPlanItemOfUnbudgetForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    delayError: 500,
    defaultValues: initDefaultValues(),
  });
  const { fields } = useFieldArray({
    control,
    name: 'items',
  });
  const {
    currency: watchCurrency,
    items: watchItems,
    currencyRate: watchCurrencyRate,
  } = watch();

  const handleSubmitForm = (data: BudgetPlanItemOfUnbudgetForm) => {
    data.items = watchItems
      .filter((item) => item.amount)
      .map((item) => ({
        month: item.month,
        quantity: item.quantity,
        amount: +item.amount || 0,
      }));
    data.totalAmount = totalAmount(Currency.Idr);
    data.totalAmountUsd = totalAmount(Currency.Usd);

    onSend(data);
    reset(initDefaultValues());
  };
  // --------------- //

  const { currencyRate } = useCurrencyRate();
  useEffect(() => {
    setValue('currencyRate', currencyRate);
  }, [currencyRate, setValue]);

  const assetGroupOptions = useAssetGroupOptions();

  const totalAmount = (currency: Currency) => {
    if (!watchCurrency) return 0;
    const total = watchItems
      .filter((item) => item.amount)
      .map((item) => +item.amount)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    if (currency === Currency.Usd) {
      return watchCurrency === Currency.Idr ? total / watchCurrencyRate : total;
    } else if (currency === Currency.Idr) {
      return watchCurrency === Currency.Usd ? total * watchCurrencyRate : total;
    }

    return 0;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDisabledQuantity = (month: number) => {
    if (period === PeriodeType.Mb) {
      if ([1, 2, 3, 4, 5, 6].includes(month)) return false;
    } else if (period === PeriodeType.S2) {
      if ([7, 8, 9, 10, 11, 12].includes(month)) return false;
    }

    return true;
  };

  const onModalOpened = () => {
    setValue('currencyRate', currencyRate);
  };

  const columns = useMemo<Column<ItemOfUnbudgetItem>[]>(
    () => [
      {
        Header: 'Month',
        accessor: 'month',
        Cell: ({ row }: CellProps<ItemOfUnbudgetItem>) =>
          moment()
            .month(row.values.month - 1)
            .format('MMMM'),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ row }: CellProps<ItemOfUnbudgetItem>) => (
          <Input
            name={`items.${row.index}.amount`}
            control={control}
            defaultValue=""
            type="number"
            placeholder="Amount"
            disabled={setDisabledQuantity(row.values.month)}
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
    [control, errors.items]
  );

  return (
    <ModalBox
      buttonTitle={buttonTitle || ''}
      buttonVariant="primary"
      submitButtonVariant="primary"
      classButton={classButton}
      title="Add Unbudget Item"
      wordingSubmit="Save"
      dialogClassName="modal-90w"
      isError={!isValid}
      onSend={handleSubmit(handleSubmitForm)}
      onClikModal={onModalOpened}
    >
      <Row>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Kurs</FormLabel>
            <FormControl
              type="text"
              value={formatMoney(watchCurrencyRate, Currency.Idr)}
              disabled
            />
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
              value={formatMoney(totalAmount(Currency.Idr), Currency.Idr)}
              disabled
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Total USD</FormLabel>
            <FormControl
              type="text"
              value={formatMoney(totalAmount(Currency.Usd), Currency.Usd)}
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

export default IsBuildingUnbudgetModal;
