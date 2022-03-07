import Checkbox from 'components/form/Checkbox';
import FileInput from 'components/form/FileInput';
import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import BudgetPlanItemModal from 'components/ui/Modal/BudgetPlanItem/BudgetPlanItemModal';
import SimpleTable from 'components/ui/Table/SimpleTable';
import { useAttachmentHelpers } from 'modules/attachment/helpers';
import { useUploadAttachment } from 'modules/attachment/hook';
import {
  BudgetPlanItemForm,
  ItemOfBudgetPlanItemForm,
} from 'modules/budgetPlanItem/entities';
import { getValueItemByMonth } from 'modules/budgetPlanItem/helpers';
import { useUpdateBudgetPlanItems } from 'modules/budgetPlanItem/hook';
import {
  useFetchBudgetPlanItemGroupDetail,
  useFetchBudgetPlanItemGroupItems,
} from 'modules/budgetPlanItemGroup/hook';
import { useDownloadTemplateHelpers } from 'modules/downloadTemplate/helpers';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { FieldError, useFieldArray, useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import { toast } from 'react-toastify';
import { setValidationError, showErrorMessage } from 'utils/helpers';

const UpdateBudgetPlanItems: NextPage = () => {
  const router = useRouter();
  const budgetPlanId = router.query.id as string;
  const budgetPlanGroupId = router.query.groupId as string;
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});

  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Detail',
      link: `/budget-plans/${budgetPlanId}/${budgetPlanGroupId}`,
    },
    {
      label: 'Create Items',
      active: true,
    },
  ];

  const { handleDownloadAttachment } = useAttachmentHelpers();
  const dataHookBudgetPlanItemGroup =
    useFetchBudgetPlanItemGroupDetail(budgetPlanGroupId);
  const dataHookBudgetPlanItemGroupItems =
    useFetchBudgetPlanItemGroupItems(budgetPlanGroupId);
  const { handleDownloadTemplate } = useDownloadTemplateHelpers();

  const {
    control,
    watch,
    setError,
    formState: { errors, isValid },
    handleSubmit,
    resetField,
    getValues,
    setValue,
    clearErrors,
  } = useForm<BudgetPlanItemForm>({
    defaultValues: {
      idCapexBudgetPlan: budgetPlanId,
    },
  });
  const { fields, replace, append, remove, update } = useFieldArray({
    control,
    name: 'budgetPlanItems',
  });
  const watchIsBuilding = watch('isBuilding');
  const watchBudgetPlanItems = watch('budgetPlanItems');

  useEffect(() => {
    setValue('isBuilding', true);
    if (dataHookBudgetPlanItemGroup.data?.isBuilding) {
      setValue('isBuilding', dataHookBudgetPlanItemGroup.data.isBuilding);
    }
  }, [dataHookBudgetPlanItemGroup.data, setValue]);

  /**
   * Set budgetPlanItems from API
   */
  useEffect(() => {
    replace(
      dataHookBudgetPlanItemGroupItems.data?.items.map((item) => ({
        ...item,
        idAssetGroup: item.catalog?.assetGroup.id,
        idCapexCatalog: item.catalog?.id,
      })) || []
    );
  }, [dataHookBudgetPlanItemGroupItems.data, replace]);

  const mutation = useUpdateBudgetPlanItems();
  const submitUpdateBudgetPlanItems = (data: BudgetPlanItemForm) => {
    mutation.mutate(
      {
        ...data,
        idCapexBudgetPlan: budgetPlanId,
        outstandingPlanPaymentAttachment: null,
        outstandingRetentionAttachment: null,
      },
      {
        onSuccess: () => {
          router.replace(`/budget-plans/${budgetPlanId}/${budgetPlanGroupId}`);
          toast('Data Updated!');
        },
        onError: (error) => {
          console.error('Failed to update data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
          setValidationError(error, setError);
        },
      }
    );
  };

  const mutationUploadAttachment = useUploadAttachment();
  const handleUploadAttachment = (name: keyof BudgetPlanItemForm) => {
    const file = getValues(name);
    const formData = new FormData();
    formData.append('module', 'budget plan');
    if (file) {
      formData.append('attachment', (file as Array<File>)[0]);
    }

    mutationUploadAttachment.mutate(formData, {
      onSuccess: (data) => {
        toast('Data uploaded!');
        setValue(name, data.name);
      },
      onError: (error) => {
        setValidationError(error, setError);
        toast(error.message, { autoClose: false });
      },
    });
  };

  const columns = useMemo<Column<ItemOfBudgetPlanItemForm>[]>(
    () => [
      { Header: 'Catalog', accessor: 'catalog' },
      { Header: 'Item', accessor: 'items' },
      { Header: 'ID Asset Group', accessor: 'idAssetGroup' },
      { Header: 'ID Capex Catalog', accessor: 'idCapexCatalog' },
      { Header: 'Currency Rate', accessor: 'currencyRate' },
      { Header: 'id', accessor: 'id' },
      {
        Header: 'Actions',
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 100 }}>
            <BudgetPlanItemModal
              onSend={(data) => update(row.index, data)}
              isEdit={true}
              buttonTitle="Edit"
              myItem={row.values as ItemOfBudgetPlanItemForm}
              isBuilding={watchIsBuilding}
            ></BudgetPlanItemModal>
          </div>
        ),
      },
      {
        Header: 'Detail',
        accessor: 'detail',
        minWidth: 300,
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
          <div style={{ minWidth: 300 }}>
            {watchIsBuilding ? row.values.detail : row.values.catalog?.detail}
          </div>
        ),
      },
      {
        Header: 'Currency',
        accessor: 'currency',
        minWidth: 150,
      },
      {
        Header: 'Price/Unit',
        accessor: 'pricePerUnit',
        minWidth: 200,
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
          row.values.pricePerUnit?.toLocaleString('id-Id') || '-',
      },
      {
        Header: 'Total USD',
        accessor: 'totalAmountUsd',
        minWidth: 200,
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
          row.values.totalAmountUsd?.toLocaleString('en-EN') || '-',
      },
      {
        Header: 'Total IDR',
        accessor: 'totalAmount',
        minWidth: 200,
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
          row.values.totalAmount?.toLocaleString('id-Id') || '-',
      },
      {
        Header: 'Jan',
        minWidth: 100,
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
        Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) => (
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
    [update, watchIsBuilding]
  );

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Budget Plan Items Update"
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
                      name="outstandingPlanPaymentAttachment"
                      control={control}
                      placeholder="Upload Excel File"
                      error={
                        (errors.outstandingPlanPaymentAttachment as FieldError)
                          ?.message
                      }
                    />
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      onClick={() => {
                        clearErrors('outstandingPlanPaymentAttachment');
                        handleUploadAttachment(
                          'outstandingPlanPaymentAttachment'
                        );
                      }}
                    >
                      <p>Upload</p>
                    </Button>
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      onClick={() =>
                        handleDownloadTemplate('outstanding plan payment')
                      }
                    >
                      <p>Download Template</p>
                    </Button>
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      onClick={() =>
                        handleDownloadAttachment({
                          fileName:
                            dataHookBudgetPlanItemGroup.data
                              ?.outstandingPlanPaymentAttachment || '',
                          module: 'budget plan',
                        })
                      }
                    >
                      <p>Download Your Previous file</p>
                    </Button>
                  </FormGroup>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <FormLabel>Oustanding Retention</FormLabel>
                    <FileInput
                      name="outstandingRetentionAttachment"
                      control={control}
                      placeholder="Upload Excel File"
                      error={
                        (errors.outstandingRetentionAttachment as FieldError)
                          ?.message
                      }
                    />
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      onClick={() => {
                        clearErrors('outstandingRetentionAttachment');
                        handleUploadAttachment(
                          'outstandingRetentionAttachment'
                        );
                      }}
                    >
                      <p>Upload</p>
                    </Button>
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      onClick={() =>
                        handleDownloadTemplate('outstanding retention')
                      }
                    >
                      <p>Download Template</p>
                    </Button>
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      onClick={() =>
                        handleDownloadAttachment({
                          fileName:
                            dataHookBudgetPlanItemGroup.data
                              ?.outstandingRetentionAttachment || '',
                          module: 'budget plan',
                        })
                      }
                    >
                      <p>Download Your Previous file</p>
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
              disabled={mutation.isLoading}
              isLoading={mutation.isLoading}
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
