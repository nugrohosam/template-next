// TODO: Next time harus refactor menggunakan https://react-hook-form.com/api/usefieldarray/
import { yupResolver } from '@hookform/resolvers/yup';
import SingleSelect, { SelectOption } from 'components/form/SingleSelect';
import { Currency, currencyOptions } from 'constants/currency';
import { useFetchAssetGroups } from 'modules/assetGroup/hook';
import {
  ItemOfBudgetPlanItem,
  ItemOfBudgetPlanItemForm,
} from 'modules/budgetPlanItem/entities';
import { Catalog } from 'modules/catalog/entities';
import { useFetchCatalogs } from 'modules/catalog/hook';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import * as yup from 'yup';

import SimpleTable from '../../Table/SimpleTable';
import ModalBox from '..';

interface NonBuildingBudgetPlanItemModalPropsProps {
  onSend: (data: ItemOfBudgetPlanItemForm) => void;
  classButton?: string;
  isEdit?: boolean;
  inPageUpdate?: { idAssetGroup: string; currency: Currency };
  buttonTitle?: string;
  myItem?: ItemOfBudgetPlanItemForm;
}

const initMyBudgetPlanItem = () =>
  [...Array(12).keys()].map((item) => ({
    month: item + 1,
    quantity: 0,
    amount: 0,
  }));

const NonBuildingBudgetPlanItemModalProps: React.FC<
  NonBuildingBudgetPlanItemModalPropsProps
> = ({
  onSend,
  classButton,
  isEdit = false,
  inPageUpdate,
  buttonTitle = '+ Add Item',
  myItem,
}) => {
  const schema = yup.object().shape({
    idAssetGroup: yup.string().required(),
    idCapexCatalog: yup.string().required(),
    pricePerUnit: yup.string().required(),
    currency: yup.string().required(),
    currencyRate: yup.string().required(),
  });

  const [kurs, setKurs] = useState<number>(14500);
  const [myBudgetPlanItem, setMyBudgetPlanItem] = useState<
    ItemOfBudgetPlanItem[]
  >(initMyBudgetPlanItem());

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    resetField,
    setValue,
    reset,
    getValues,
  } = useForm<ItemOfBudgetPlanItemForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const watchAssetGroup = watch('idAssetGroup');
  const watchPricePerUnit = watch('pricePerUnit', 0);
  const watchCurrency = watch('currency');

  const handleSubmitForm = (data: ItemOfBudgetPlanItemForm) => {
    data.items = myBudgetPlanItem.filter((item) => item.quantity);
    data.totalAmount = +totalAmount();
    data.totalAmountUsd = +totalAmountUsd();
    data.pricePerUnit = data.pricePerUnit ? +data.pricePerUnit : null;
    data.currencyRate = +data.currencyRate;
    data.catalog = dataHookCatalogs.data?.items.find(
      (item) => item.id === data.idCapexCatalog
    );
    onSend(data);
    reset();
    setMyBudgetPlanItem(initMyBudgetPlanItem());
  };

  // asset group options
  const dataHookAssetGroups = useFetchAssetGroups({ pageSize: 50 });
  const assetGroupOptions: SelectOption[] =
    dataHookAssetGroups.data?.items.map((item) => ({
      value: item.id,
      label: item.assetGroup,
    })) || [];

  // catalog options
  const dataHookCatalogs = useFetchCatalogs({
    pageSize: 50,
    assetGroupId: watchAssetGroup,
  });
  const dataHookCatalogOptions: (Catalog & SelectOption)[] =
    dataHookCatalogs.data?.items.map((item) => ({
      value: item.id,
      label: item.detail,
      ...item,
    })) || [];

  const changeCatalog = (idCapexCatalog: string) => {
    const found = dataHookCatalogs.data?.items.find(
      (item) => item.id === idCapexCatalog
    );
    // TODO: data ini masih di hardcode
    setValue('currencyRate', 10000);
    if (getValues('currency')) {
      const pricePerUnit =
        (getValues('currency') === 'IDR'
          ? found?.priceInIdr
          : found?.priceInUsd) || 0;
      setValue('pricePerUnit', pricePerUnit);
      reCalculateItems(pricePerUnit);
    }
  };

  const changeCurrency = (currency: Currency) => {
    const idCapexCatalog = getValues('idCapexCatalog');
    const found = dataHookCatalogs.data?.items.find(
      (item) => item.id === idCapexCatalog
    );
    if (idCapexCatalog) {
      const pricePerunit =
        (currency === Currency.IDR ? found?.priceInIdr : found?.priceInUsd) ||
        0;
      setValue('pricePerUnit', pricePerunit);
      reCalculateItems(pricePerunit);
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
          <FormControl
            type="text"
            value={row.values.quantity}
            onChange={(val) => {
              setMyBudgetPlanItem((prev) =>
                prev.map((item, index) => {
                  return index === row.index
                    ? {
                        ...item,
                        quantity: +val.target.value,
                        amount: +val.target.value * (watchPricePerUnit || 0),
                      }
                    : item;
                })
              );
            }}
          />
        ),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItem>) => (
          <FormControl
            type="text"
            value={row.values.amount.toLocaleString(
              watchCurrency === Currency.USD ? 'en-En' : 'id-Id'
            )}
            disabled
          />
        ),
      },
    ],
    [watchPricePerUnit, setMyBudgetPlanItem, watchCurrency]
  );

  const reCalculateItems = (pricePerUnit: number) => {
    setMyBudgetPlanItem((prev) =>
      prev.map((item) => ({
        ...item,
        amount: ((item.quantity as number) || 0) * (pricePerUnit || 0),
      }))
    );
  };

  const totalAmount = () => {
    if (!watchCurrency) return 0;
    const total = myBudgetPlanItem
      .map((item) => item.amount)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    return watchCurrency === Currency.USD ? total * kurs : total;
  };

  const totalAmountUsd = () => {
    if (!watchCurrency) return 0;
    const total = myBudgetPlanItem
      .map((item) => item.amount)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    return watchCurrency === Currency.IDR ? total / kurs : total;
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
      });
      setMyBudgetPlanItem((prevs) =>
        prevs.map((prev) => {
          const foundMonth = myItem?.items.find(
            (item) => item.month === prev.month
          );
          return foundMonth || prev;
        })
      );
    } else if (inPageUpdate) {
      /**
       * special condition when create item in update page,
       * field idAssetGroup and currency will disable.
       * Because the value will get from index 0 budget plan items
       */
      reset({
        idAssetGroup: inPageUpdate.idAssetGroup,
        currency: inPageUpdate.currency,
      });
    }
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
              isDisabled={isEdit || !!inPageUpdate}
              onChange={() => {
                resetField('idCapexCatalog');
                resetField('currency');
                resetField('currencyRate');
                resetField('pricePerUnit');
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
              options={dataHookCatalogOptions}
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
              error={errors.idCapexCatalog?.message}
              isDisabled={isEdit || !!inPageUpdate}
              onChange={(val) => changeCurrency(val.value as Currency)}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Price/Unit</FormLabel>
            <FormControl
              type="text"
              value={watchPricePerUnit?.toLocaleString('id-Id') || 0}
              disabled
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
              value={totalAmountUsd().toLocaleString('en-EN')}
              disabled
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <SimpleTable
          classTable="table-admin table-inherit"
          columns={columns}
          items={myBudgetPlanItem}
        />
      </Row>
    </ModalBox>
  );
};

export default NonBuildingBudgetPlanItemModalProps;
