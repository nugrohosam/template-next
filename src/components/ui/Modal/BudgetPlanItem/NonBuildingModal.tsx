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
  currencyRate: 10000, // TODO: currenctRate masih dummy
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
    formState: { errors },
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
    data.totalAmount = totalAmount(Currency.IDR);
    data.totalAmountUsd = totalAmount(Currency.USD);
    data.catalog = catalogOptions.find(
      (item) => item.id === data.idCapexCatalog
    );

    onSend(data);
    reset(initDefaultValues());
  };
  // --------------- //

  const { kurs } = useKurs();
  const assetGroupOptions = useAssetGroupOptions().filter(
    (item) => item.label !== 'Building'
  );
  const catalogOptions = useCatalogOptions(watchIdAssetGroup);

  const changeCatalog = (idCapexCatalog: string) => {
    const found = catalogOptions.find((item) => item.id === idCapexCatalog);
    if (watchCurrency && found) {
      setValue(
        'pricePerUnit',
        watchCurrency === Currency.IDR ? found?.priceInIdr : found?.priceInUsd
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
        currency === Currency.IDR ? found?.priceInIdr : found?.priceInUsd
      );
    }
  };

  const totalAmount = (currency: Currency) => {
    if (!watchCurrency) return 0;
    const total = controlledFields
      .filter((item) => item.amount)
      .map((item) => item.amount)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    if (currency === Currency.USD) {
      return watchCurrency === Currency.IDR ? total / kurs : total;
    } else if (currency === Currency.IDR) {
      return watchCurrency === Currency.USD ? total * kurs : total;
    }

    return 0;
  };

  const onModalOpened = () => {
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
                ? row.values.amount.toLocaleString(
                    watchCurrency === Currency.USD ? 'en-En' : 'id-Id'
                  )
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
      isError={errors}
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
          items={controlledFields}
        />
      </Row>
    </ModalBox>
  );
};

export default NonBuildingBudgetPlanItemModal;
