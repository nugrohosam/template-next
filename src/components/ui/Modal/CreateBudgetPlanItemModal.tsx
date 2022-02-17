// TODO: Next time harus refactor
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import SingleSelect, { SelectOption } from 'components/form/SingleSelect';
import { currencyOptions } from 'constants/currency';
import { useFetchAssetGroups } from 'modules/assetGroup/hook';
import {
  ItemOfBudgetPlanItemForm,
  ItemOfItemOfBudgetPlanItemForm,
} from 'modules/budgetPlanItem/entities';
import { Catalog } from 'modules/catalog/entities';
import { useFetchCatalogs } from 'modules/catalog/hook';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import * as yup from 'yup';

import SimpleTable from '../Table/SimpleTable';
import ModalBox from '.';

interface RejectModalProps {
  onSend: (data: ItemOfBudgetPlanItemForm) => void;
  classButton?: string;
}

const CreateBudgetPlanItemModal: React.FC<RejectModalProps> = ({
  onSend,
  classButton,
}) => {
  const schema = yup.object().shape({
    idAssetGroup: yup.string().required(),
    idCapexCatalog: yup.string().required(),
    pricePerUnit: yup.string().required(),
    currency: yup.string().required(),
    currencyRate: yup.string().required(),
    totalAmount: yup.string().required(),
    totalAmountUsd: yup.string().required(),
  });

  const [myBudgetPlanItem, setMyBudgetPlanItem] = useState<
    ItemOfItemOfBudgetPlanItemForm[]
  >(
    [...Array(12).keys()].map((item) => ({
      month: item + 1,
      quantity: '',
      amount: 0,
    }))
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    resetField,
    setValue,
  } = useForm<ItemOfBudgetPlanItemForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const watchAssetGroup = watch('idAssetGroup');
  const watchPricePerUnit = watch('pricePerUnit', 0);

  const handleSubmitForm = (data: ItemOfBudgetPlanItemForm) =>
    onSend({ ...data, items: myBudgetPlanItem });

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
    setValue('totalAmount', found?.priceInIdr || 0);
    setValue('totalAmountUsd', found?.priceInUsd || 0);
    // TODO: 2 data ini masih di hardcode
    setValue('pricePerUnit', 1000000);
    setValue('currencyRate', 10000);
  };

  const columns = useMemo<Column<ItemOfItemOfBudgetPlanItemForm>[]>(
    () => [
      {
        Header: 'Month',
        accessor: 'month',
        Cell: ({ row }: CellProps<ItemOfItemOfBudgetPlanItemForm>) =>
          moment()
            .month(row.values.month - 1)
            .format('MMMM'),
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        Cell: ({ row }: CellProps<ItemOfItemOfBudgetPlanItemForm>) => (
          <FormControl
            type="number"
            value={row.values.quantity}
            onChange={(val) =>
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
              )
            }
          />
        ),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ row }: CellProps<ItemOfItemOfBudgetPlanItemForm>) => (
          <FormControl type="text" value={row.values.amount} disabled />
        ),
      },
    ],
    [watchPricePerUnit, setMyBudgetPlanItem]
  );

  return (
    <ModalBox
      buttonTitle="+ Add Item"
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
            <FormControl type="text" value="14.500" disabled />
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
              onChange={() => {
                resetField('idCapexCatalog');
                resetField('totalAmount');
                resetField('totalAmountUsd');
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
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Price/Unit</FormLabel>
            <Input
              name="pricePerUnit"
              control={control}
              defaultValue=""
              type="text"
              placeholder="Price/Unit"
              disabled
              error={errors.pricePerUnit?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Total IDR</FormLabel>
            <Input
              name="totalAmount"
              control={control}
              defaultValue=""
              type="text"
              placeholder="Total IDR"
              disabled
              error={errors.totalAmount?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Total USD</FormLabel>
            <Input
              name="totalAmountUsd"
              control={control}
              defaultValue=""
              type="text"
              placeholder="Total USD"
              disabled
              error={errors.totalAmountUsd?.message}
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

export default CreateBudgetPlanItemModal;
