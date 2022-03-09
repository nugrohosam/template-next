import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import SingleSelect from 'components/form/SingleSelect';
import { Currency, currencyOptions } from 'constants/currency';
import { PeriodeType } from 'constants/period';
import { useAssetGroupOptions } from 'modules/assetGroup/helpers';
import { useCatalogOptions } from 'modules/catalog/helpers';
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
import * as yup from 'yup';

import SimpleTable from '../../Table/SimpleTable';
import ModalBox from '..';
import { UnbudgetModalProps } from './UnbudgetModal';

const initDefaultValues = () => ({
  idAssetGroup: '',
  idCapexCatalog: '',
  pricePerUnit: 0,
  currency: null,
  detail: null,
  totalAmount: 0,
  totalAmountUsd: 0,
  currencyRate: 10000, // TODO: currenctRate masih dummy
  items: [...Array(12).keys()].map((item) => ({
    month: item + 1,
    amount: 0,
  })),
});

const schema = yup.object().shape({
  idAssetGroup: yup.string().required(),
  idCapexCatalog: yup.string().required(),
  pricePerUnit: yup.number().required(),
  currency: yup.string().required().nullable(),
  currencyRate: yup.number().required(),
});

const NonBuildingUnbudgetModal: React.FC<UnbudgetModalProps> = ({
  onSend,
  classButton,
  buttonTitle,
  period,
  inPageUpdate,
}) => {
  /**
   * Handle form
   */
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    resetField,
    setValue,
    reset,
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
    idAssetGroup: watchIdAssetGroup,
    pricePerUnit: watchPricePerUnit,
    idCapexCatalog: watchIdCapexCatalog,
    items: watchItems,
    currencyRate: watchCurrencyRate,
  } = watch();
  const controlledFields = fields.map((field, index) => {
    return {
      ...watchItems[index],
      amount: +watchItems[index].quantity * (watchPricePerUnit || 0),
    };
  });

  const handleSubmitForm = (data: BudgetPlanItemOfUnbudgetForm) => {
    data.items = controlledFields
      .filter((item) => item.quantity)
      .map((item) => ({
        month: item.month,
        quantity: +item.quantity || 0,
        amount: item.amount || 0,
      }));
    data.totalAmount = totalAmount(Currency.Idr);
    data.totalAmountUsd = totalAmount(Currency.Usd);
    data.catalog = catalogOptions.find(
      (item) => item.id === data.idCapexCatalog
    );

    onSend(data);
    reset(initDefaultValues());
  };
  // --------------- //

  const { currencyRate } = useCurrencyRate();
  useEffect(() => {
    setValue('currencyRate', currencyRate);
  }, [currencyRate, setValue]);

  const assetGroupOptions = useAssetGroupOptions();
  const catalogOptions = useCatalogOptions(watchIdAssetGroup);

  const changeCatalog = (idCapexCatalog: string) => {
    const found = catalogOptions.find((item) => item.id === idCapexCatalog);
    if (found) {
      const currency = found.primaryCurrency || null;
      setValue('currency', currency);
      setValue(
        'pricePerUnit',
        currency === Currency.Idr ? found?.priceInIdr : found?.priceInUsd
      );
    }
  };

  const changeCurrency = (currency: Currency) => {
    const found = catalogOptions.find(
      (item) => item.id === watchIdCapexCatalog
    );
    if (watchIdCapexCatalog && found) {
      setValue(
        'pricePerUnit',
        currency === Currency.Idr ? found?.priceInIdr : found?.priceInUsd
      );
    }
  };

  const totalAmount = (currency: Currency) => {
    if (!watchCurrency) return 0;
    const total = controlledFields
      .filter((item) => item.amount)
      .map((item) => item.amount)
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
    if (inPageUpdate) {
      /**
       * special condition when create item in update page,
       * field idAssetGroup and currency will disable.
       * Because the value will get from index 0 budget plan items
       */
      reset({
        ...initDefaultValues(),
        idAssetGroup: inPageUpdate.idAssetGroup,
        currency: inPageUpdate.currency,
      });
    }
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
        Header: 'Quantity',
        accessor: 'quantity',
        Cell: ({ row }: CellProps<ItemOfUnbudgetItem>) => (
          <Input
            name={`items.${row.index}.quantity`}
            control={control}
            defaultValue=""
            type="number"
            placeholder="Quantity"
            disabled={setDisabledQuantity(row.values.month)}
            error={
              (errors.items?.length &&
                errors.items[row.index].quantity?.message) ||
              ''
            }
          />
        ),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ row }: CellProps<ItemOfUnbudgetItem>) => (
          <FormControl
            type="text"
            value={
              row.values.amount
                ? row.values.amount.toLocaleString(
                    watchCurrency === Currency.Usd ? 'en-En' : 'id-Id'
                  )
                : 0
            }
            disabled
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [control, errors.items, watchCurrency]
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
            <FormControl type="text" value={watchCurrencyRate} disabled />
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
              isDisabled={!!inPageUpdate}
              onChange={() => {
                resetField('idCapexCatalog');
                resetField('currency');
                resetField('currencyRate');
                resetField('pricePerUnit');
                resetField('items');
              }}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Katalog</FormLabel>
            <SingleSelect
              name="idCapexCatalog"
              control={control}
              defaultValue=""
              placeholder="Katalog"
              options={catalogOptions}
              error={errors.idCapexCatalog?.message}
              onChange={(val) => changeCatalog(val.value as string)}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Currency</FormLabel>
            <SingleSelect
              name="currency"
              control={control}
              defaultValue=""
              placeholder="Currency"
              options={currencyOptions}
              error={errors.currency?.message}
              isDisabled={!!inPageUpdate}
              onChange={(val) => changeCurrency(val.value as Currency)}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Price/Unit</FormLabel>
            <Input
              name="pricePerUnit"
              control={control}
              defaultValue={0}
              type="number"
              disabled
              error={errors.pricePerUnit?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Total IDR</FormLabel>
            <FormControl
              type="text"
              value={totalAmount(Currency.Idr).toLocaleString('id-Id')}
              disabled
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Total USD</FormLabel>
            <FormControl
              type="text"
              value={totalAmount(Currency.Usd).toLocaleString('en-EN')}
              disabled
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <SimpleTable
          classTable="table-admin table-inherit"
          columns={columns}
          items={controlledFields}
        />
      </Row>
    </ModalBox>
  );
};

export default NonBuildingUnbudgetModal;
