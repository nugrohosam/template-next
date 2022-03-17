import Checkbox from 'components/form/Checkbox';
import FileInput from 'components/form/FileInput';
import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import BudgetPlanItemModal from 'components/ui/Modal/BudgetPlanItem/BudgetPlanItemModal';
import SimpleTable from 'components/ui/Table/SimpleTable';
import { Currency } from 'constants/currency';
import { useAttachmentHelpers } from 'modules/attachment/helpers';
import {
  BudgetPlanItemForm,
  BudgetPlanItemOfBudgetPlanItemForm,
} from 'modules/budgetPlanItem/entities';
import {
  getValueItemByMonth,
  useBudgetPlanItemHelpers,
} from 'modules/budgetPlanItem/helpers';
import {
  useFetchBudgetPlanItemGroupDetail,
  useFetchBudgetPlanItemGroupItems,
} from 'modules/budgetPlanItemGroup/hook';
import { useDownloadTemplateHelpers } from 'modules/downloadTemplate/helpers';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import { formatMoney, setValidationError } from 'utils/helpers';

const UpdateBudgetPlanItems: NextPage = () => {
  const router = useRouter();
  const idBudgetPlan = router.query.id as string;
  const idBudgetPlanGroup = router.query.groupId as string;
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});

  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Detail',
      link: `/budget-plans/${idBudgetPlan}/${idBudgetPlanGroup}`,
    },
    {
      label: 'Create Items',
      active: true,
    },
  ];

  const dataHookBudgetPlanItemGroup =
    useFetchBudgetPlanItemGroupDetail(idBudgetPlanGroup);
  const dataHookBudgetPlanItemGroupItems =
    useFetchBudgetPlanItemGroupItems(idBudgetPlanGroup);

  const {
    control,
    watch,
    setError,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
  } = useForm<BudgetPlanItemForm>({
    defaultValues: {
      idCapexBudgetPlan: idBudgetPlan,
    },
  });
  const { fields, replace, append, remove, update } = useFieldArray({
    control,
    name: 'budgetPlanItems',
    keyName: 'key',
  });
  const {
    isBuilding: watchIsBuilding,
    budgetPlanItems: watchBudgetPlanItems,
    outstandingPlanPaymentAttachmentFile:
      watchOutstandingPlanPaymentAttachmentFile,
    outstandingRetentionAttachmentFile: watchOutstandingRetentionAttachmentFile,
    outstandingPlanPaymentAttachment: watchOutstandingPlanPaymentAttachment,
    outstandingRetentionAttachment: watchOutstandingRetentionAttachment,
  } = watch();

  useEffect(() => {
    if (dataHookBudgetPlanItemGroup.data?.isBuilding) {
      setValue('isBuilding', dataHookBudgetPlanItemGroup.data.isBuilding);
      setValue(
        'outstandingPlanPaymentAttachment',
        dataHookBudgetPlanItemGroup.data.outstandingPlanPaymentAttachment
      );
      setValue(
        'outstandingRetentionAttachment',
        dataHookBudgetPlanItemGroup.data.outstandingRetentionAttachment
      );
    }
  }, [dataHookBudgetPlanItemGroup.data, setValue]);

  /**
   * Set budgetPlanItems from API
   */
  useEffect(() => {
    replace(
      dataHookBudgetPlanItemGroupItems.data?.items.map((item) => ({
        ...item,
        idAssetGroup: watchIsBuilding
          ? item.assetGroupId
          : item.catalog?.assetGroup?.id,
        idCapexCatalog: item.catalog?.id,
      })) || []
    );
  }, [dataHookBudgetPlanItemGroupItems.data, replace, watchIsBuilding]);

  const { mutationUpdateBudgetPlanItem, handleUpdateBudgetPlanItem } =
    useBudgetPlanItemHelpers();
  const submitUpdateBudgetPlanItems = (data: BudgetPlanItemForm) => {
    delete data.outstandingPlanPaymentAttachmentFile;
    delete data.outstandingRetentionAttachmentFile;
    data.idCapexBudgetPlan = idBudgetPlan;
    data.idBudgetPlanItemGroup = idBudgetPlanGroup;
    data.budgetPlanItems.map((item) => {
      delete item.catalog;
      return item;
    });

    handleUpdateBudgetPlanItem(data)
      .then(() =>
        router.replace(`/budget-plans/${idBudgetPlan}/${idBudgetPlanGroup}`)
      )
      .catch((error) => setValidationError(error, setError));
  };

  const { handleDownloadTemplate } = useDownloadTemplateHelpers();
  const { handleUploadAttachment } = useAttachmentHelpers();
  const uploadAttachment = (attachment: keyof BudgetPlanItemForm) => {
    const file = getValues(`${attachment}File` as keyof BudgetPlanItemForm);
    handleUploadAttachment(file as File[], 'budget plan')
      .then((result) => setValue(attachment, result.name))
      .catch((error) => setValidationError(error, setError));
  };

  const columns = useMemo<Column<BudgetPlanItemOfBudgetPlanItemForm>[]>(
    () => [
      { Header: 'Catalog', accessor: 'catalog' },
      { Header: 'Item', accessor: 'items' },
      { Header: 'ID Asset Group', accessor: 'idAssetGroup' },
      { Header: 'ID Capex Catalog', accessor: 'idCapexCatalog' },
      { Header: 'Currency Rate', accessor: 'currencyRate' },
      { Header: 'ID', accessor: 'id' },
      {
        Header: 'Actions',
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            <BudgetPlanItemModal
              onSend={(data) => update(row.index, data)}
              isEdit={true}
              buttonTitle="Edit"
              myItem={row.values as BudgetPlanItemOfBudgetPlanItemForm}
              isBuilding={watchIsBuilding}
              onClickModal={() => clearErrors()}
            ></BudgetPlanItemModal>
          </div>
        ),
      },
      {
        Header: 'Detail',
        accessor: 'detail',
        minWidth: 300,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) =>
          (watchIsBuilding ? row.values.detail : row.values.catalog?.detail) ||
          '-',
      },
      {
        Header: 'Currency',
        accessor: 'currency',
        minWidth: 150,
      },
      {
        Header: 'Price/Unit',
        accessor: 'pricePerUnit',
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) =>
          formatMoney(row.values.pricePerUnit, Currency.Idr, '-'),
      },
      {
        Header: 'Total USD',
        accessor: 'totalAmountUsd',
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) =>
          formatMoney(row.values.totalAmountUsd, Currency.Usd, '-'),
      },
      {
        Header: 'Total IDR',
        accessor: 'totalAmount',
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) =>
          formatMoney(row.values.totalAmount, Currency.Idr, '-'),
      },
      {
        Header: 'Jan',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              1,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Feb',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              2,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Mar',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              3,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Apr',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              4,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Mei',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              5,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Jun',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              6,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Jul',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              7,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Aug',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              8,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Sep',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              9,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Oct',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              10,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Nov',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              11,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
      {
        Header: 'Dec',
        minWidth: 100,
        Cell: ({ row }: CellProps<BudgetPlanItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            {getValueItemByMonth(
              row.values.items,
              12,
              watchIsBuilding,
              row.values.currency
            )}
          </div>
        ),
      },
    ],
    [clearErrors, update, watchIsBuilding]
  );

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Update Budget Plan Items"
    >
      <Panel>
        <Form onSubmit={handleSubmit(submitUpdateBudgetPlanItems)}>
          <Row>
            <SimpleTable
              classTable="table-admin table-inherit"
              columns={columns}
              items={fields}
              selectedRows={selectedRow}
              hiddenColumns={[
                'items',
                'catalog',
                'idAssetGroup',
                'idCapexCatalog',
                'currencyRate',
                'id',
              ]}
              onSelectedRowsChanged={(rows) => setSelectedRow(rows)}
              addOns={
                <div className="d-flex align-items-center">
                  <div className="mr-2">
                    <Checkbox
                      label="Is Building"
                      name="isBuilding"
                      defaultValue=""
                      control={control}
                      disabled={true}
                    ></Checkbox>
                  </div>
                  <BudgetPlanItemModal
                    onSend={(data) => append(data)}
                    isBuilding={watchIsBuilding}
                    {...(watchBudgetPlanItems && {
                      inPageUpdate: {
                        idAssetGroup: watchBudgetPlanItems[0]?.idAssetGroup,
                        currency: watchBudgetPlanItems[0]?.currency,
                      },
                    })}
                    onClickModal={() => clearErrors()}
                  ></BudgetPlanItemModal>
                </div>
              }
              actions={
                <Button
                  variant="red"
                  size="sm"
                  className="mr-2"
                  onClick={() => remove(+Object.keys(selectedRow))}
                >
                  Delete
                </Button>
              }
            />
          </Row>

          {watchIsBuilding && (
            <>
              <br />
              <Row>
                <Col lg={6}>
                  <FormGroup>
                    <FormLabel>Oustanding Plan Payment</FormLabel>
                    <FileInput
                      name="outstandingPlanPaymentAttachmentFile"
                      control={control}
                      placeholder={
                        watchOutstandingPlanPaymentAttachment ||
                        'Upload Excel File'
                      }
                      error={errors.outstandingPlanPaymentAttachment?.message}
                    />
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      disabled={!!!watchOutstandingPlanPaymentAttachmentFile}
                      onClick={() => {
                        clearErrors('outstandingPlanPaymentAttachment');
                        uploadAttachment('outstandingPlanPaymentAttachment');
                      }}
                    >
                      <p className="mb-0">Upload</p>
                    </Button>
                    <br />
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      onClick={() =>
                        handleDownloadTemplate('outstanding plan payment')
                      }
                    >
                      <p>Download Template</p>
                    </Button>
                  </FormGroup>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <FormLabel>Oustanding Retention</FormLabel>
                    <FileInput
                      name="outstandingRetentionAttachmentFile"
                      control={control}
                      placeholder={
                        watchOutstandingRetentionAttachment ||
                        'Upload Excel File'
                      }
                      error={errors.outstandingRetentionAttachment?.message}
                    />
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      disabled={!!!watchOutstandingRetentionAttachmentFile}
                      onClick={() => {
                        clearErrors('outstandingRetentionAttachment');
                        uploadAttachment('outstandingRetentionAttachment');
                      }}
                    >
                      <p className="mb-0">Upload</p>
                    </Button>
                    <br />
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      onClick={() =>
                        handleDownloadTemplate('outstanding retention')
                      }
                    >
                      <p>Download Template</p>
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}

          <br />

          <Col lg={12} className="d-flex pr-sm-0 justify-content-end">
            <LoadingButton
              variant="primary"
              type="submit"
              disabled={mutationUpdateBudgetPlanItem.isLoading}
              isLoading={mutationUpdateBudgetPlanItem.isLoading}
            >
              Update
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default UpdateBudgetPlanItems;
