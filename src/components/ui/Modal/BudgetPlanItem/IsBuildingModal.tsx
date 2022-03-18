import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import SingleSelect from 'components/form/SingleSelect';
import { Currency, currencyOptions } from 'constants/currency';
import { UserDistrict } from 'constants/user';
import { useAssetGroupOptions } from 'modules/assetGroup/helpers';
import {
  BudgetPlanItemOfBudgetPlanItemForm,
  ItemOfBudgetPlanItem,
} from 'modules/budgetPlanItem/entities';
import { useCurrencyRate } from 'modules/custom/useCurrencyRate';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { useDistrictOptions } from 'modules/custom/useDistrictOptions';
import { useNoiDivisionOptions } from 'modules/noi/division/helpers';
import { permissionUserHelpers } from 'modules/user/helpers';
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
    quantity: 0,
  }));
const initDefaultValues = () => ({
  idAssetGroup: '',
  currency: null,
  detail: '',
  pricePerUnit: 0,
  idCapexCatalog: null,
  currencyRate: 0,
  items: initItems(),
});

const schema = yup.object().shape({
  idAssetGroup: yup.string().required(),
  currency: yup.string().required().nullable(),
  detail: yup.string().required().nullable(),
  districtCode: yup.string().required(),
  departmentCode: yup.string().required(),
});

const IsBuildingBudgetPlanItemModal: React.FC<
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
  const [profile] = useDecodeToken();

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
    resetField,
  } = useForm<BudgetPlanItemOfBudgetPlanItemForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    delayError: 500,
    defaultValues: initDefaultValues(),
  });
  const { fields } = useFieldArray({
    control,
    name: 'items',
    keyName: 'key',
  });
  const {
    currency: watchCurrency,
    items: watchItems,
    currencyRate: watchCurrencyRate,
    districtCode: watchDistrictCode,
  } = watch();

  const handleSubmitForm = (data: BudgetPlanItemOfBudgetPlanItemForm) => {
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

  // set currency rate
  const { currencyRate } = useCurrencyRate();
  useEffect(() => {
    setValue('currencyRate', currencyRate);
  }, [currencyRate, setValue]);

  const [districtOptions] = useDistrictOptions();
  const { noiDivisionOptions } = useNoiDivisionOptions({
    district: watchDistrictCode,
  });
  const assetGroupOptions = useAssetGroupOptions().filter(
    (item) => item.label === 'Building'
  );

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

  const { isUserJiep } = permissionUserHelpers();

  const onModalOpened = () => {
    if (isEdit) {
      reset({
        idAssetGroup: myItem?.idAssetGroup,
        pricePerUnit: myItem?.pricePerUnit,
        currency: myItem?.currency,
        currencyRate: myItem?.currencyRate,
        id: myItem?.id,
        detail: myItem?.detail || '',
        districtCode: myItem?.districtCode,
        departmentCode: myItem?.departmentCode,
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
        currencyRate: currencyRate,
      });
    }

    if (!watchCurrencyRate) setValue('currencyRate', currencyRate);
    if (profile && !isUserJiep(profile?.district_code)) {
      setValue('districtCode', profile?.district_code);
      setValue('departmentCode', profile?.job_group);
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
            <FormLabel>District</FormLabel>
            <SingleSelect
              name="districtCode"
              control={control}
              defaultValue=""
              placeholder="District"
              options={districtOptions}
              error={errors.districtCode?.message}
              isDisabled={!isUserJiep(profile?.district_code)}
              onChange={() => resetField('departmentCode')}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel>Department</FormLabel>
            <SingleSelect
              name="departmentCode"
              control={control}
              defaultValue=""
              placeholder="Department"
              options={noiDivisionOptions}
              isDisabled={!isUserJiep(profile?.district_code)}
              error={errors.departmentCode?.message}
            />
          </FormGroup>
        </Col>
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
              isDisabled={!!inPageUpdate || isEdit}
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
              defaultValue=""
              placeholder="Currency"
              options={currencyOptions}
              isDisabled={!!inPageUpdate || isEdit}
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

export default IsBuildingBudgetPlanItemModal;
