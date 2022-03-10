import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import SingleSelect from 'components/form/SingleSelect';
import { Currency, currencyOptions } from 'constants/currency';
import { useAssetGroupOptions } from 'modules/assetGroup/helpers';
import {
  BudgetPlanItemOfBudgetPlanItemForm,
  ItemOfBudgetPlanItem,
} from 'modules/budgetPlanItem/entities';
import { useCatalogOptions } from 'modules/catalog/helpers';
import { useCurrencyRate } from 'modules/custom/useCurrencyRate';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import { formatMoney } from 'utils/helpers';
import * as yup from 'yup';

import SimpleTable from '../../Table/SimpleTable';
import ModalBox from '..';
import { BudgetPlanItemModalProps } from './BudgetPlanItemModal';

const initItems = () =>
  [...Array(12).keys()].map((item) => ({
    month: item + 1,
    amount: 0,
  }));
const initDefaultValues = () => ({
  idAssetGroup: '',
  idCapexCatalog: '',
  pricePerUnit: 0,
  currency: null,
  detail: null,
  totalAmount: 0,
  totalAmountUsd: 0,
  currencyRate: 0,
  items: initItems(),
});

const schema = yup.object().shape({
  idAssetGroup: yup.string().required(),
  idCapexCatalog: yup.string().required(),
  pricePerUnit: yup.number().required(),
  currency: yup.string().required().nullable(),
  currencyRate: yup.number().required(),
});

const NonBuildingBudgetPlanItemModal: React.FC<
  BudgetPlanItemModalProps & { title: string }
> = ({
  onSend,
  classButton,
  buttonTitle,
  inPageUpdate,
  isEdit,
  myItem,
  title,
}) => {
  /**
   * Handle form
   */
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    setValue,
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

  const handleSubmitForm = (data: BudgetPlanItemOfBudgetPlanItemForm) => {
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

  const assetGroupOptions = useAssetGroupOptions().filter(
    (item) => item.label !== 'Building'
  );
  const catalogOptions = useCatalogOptions(watchIdAssetGroup);

  const changeCatalog = (idCapexCatalog: string) => {
    const found = catalogOptions.find((item) => item.id === idCapexCatalog);
    if (found) {
      const currency = found?.primaryCurrency || null;
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

  const onModalOpened = () => {
    setValue('currencyRate', currencyRate);
    if (isEdit) {
      reset({
        idAssetGroup: myItem?.idAssetGroup,
        idCapexCatalog: myItem?.idCapexCatalog,
        pricePerUnit: myItem?.pricePerUnit,
        currency: myItem?.currency,
        currencyRate: myItem?.currencyRate,
        id: myItem?.id,
        items:
          initItems().map((prev) => {
            const foundMonth = myItem?.items.find(
              (item) => item.month === prev.month
            );
            return foundMonth || prev;
          }) || [],
      });
    } else if (inPageUpdate) {
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
        Header: 'Quantity',
        accessor: 'quantity',
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItem>) => (
          <Input
            name={`items.${row.index}.quantity`}
            control={control}
            defaultValue=""
            type="number"
            placeholder="Quantity"
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItem>) => (
          <FormControl
            type="text"
            value={
              row.values.amount
                ? formatMoney(row.values.amount, watchCurrency)
                : 0
            }
            disabled
          />
        ),
      },
    ],
    [control, errors.items, watchCurrency]
  );

  return (
    <ModalBox
      buttonTitle={buttonTitle || ''}
      buttonVariant="primary"
      submitButtonVariant="primary"
      classButton={classButton}
      title={title}
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
              isDisabled={!!inPageUpdate}
              onChange={() => {
                setValue('idCapexCatalog', '');
                setValue('currency', null);
                setValue('pricePerUnit', 0);
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
          items={controlledFields}
        />
      </Row>
    </ModalBox>
  );
};

export default NonBuildingBudgetPlanItemModal;
