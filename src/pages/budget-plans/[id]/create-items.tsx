/**
 * Harus refactor selanjutnya, pakai https://react-hook-form.com/api/usefieldarray/
 * TODO: untuk sekarang upload attachment masih menggunakan button upload manual
 */
import Checkbox from 'components/form/Checkbox';
import FileInput from 'components/form/FileInput';
import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import IsBuildingBudgetPlanItemModal from 'components/ui/Modal/BudgetPlanItem/IsBuildingModal';
import NonBuildingBudgetPlanItemModal from 'components/ui/Modal/BudgetPlanItem/NonBuildingModal';
import SimpleTable from 'components/ui/Table/SimpleTable';
import { useUploadAttachment } from 'modules/attachment/hook';
import {
  BudgetPlanItemForm,
  ItemOfBudgetPlanItemForm,
} from 'modules/budgetPlanItem/entities';
import { getValueItemByMonth } from 'modules/budgetPlanItem/helpers';
import { useCreateBudgetPlanItems } from 'modules/budgetPlanItem/hook';
import { useDownloadTemplateExcel } from 'modules/downloadTemplate/hook';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { FieldError, useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import { toast } from 'react-toastify';
import { setValidationError, showErrorMessage } from 'utils/helpers';

const CreatePeriodActual: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});

  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Detail',
      link: `/budget-plans/${id}/detail`,
    },
    {
      label: 'Create Items',
      active: true,
    },
  ];

  const [myBudgetPlanItem, setMyBudgetPlanItem] = useState<
    ItemOfBudgetPlanItemForm[]
  >([]);

  const handleDeleteMultipleMyBudgetPlanItem = () => {
    setMyBudgetPlanItem((prev) =>
      prev.filter(
        (item, i) =>
          !Object.keys(selectedRow)
            .map((key) => +key)
            .includes(i)
      )
    );
  };

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
  } = useForm<BudgetPlanItemForm>();
  const watchIsBuilding = watch('isBuilding');
  useEffect(() => {
    setMyBudgetPlanItem([]);
    resetField('outstandingPlanPaymentAttachment');
    resetField('outstandingRetentionAttachment');
  }, [resetField, watchIsBuilding]);

  const mutationCreateBudgetPlanItems = useCreateBudgetPlanItems();
  const mutationUploadAttachment = useUploadAttachment();
  const submitCreateBudgetPlanItems = (data: BudgetPlanItemForm) => {
    mutationCreateBudgetPlanItems.mutate(
      {
        idCapexBudgetPlan: id,
        isBuilding: data.isBuilding,
        outstandingPlanPaymentAttachment: data.outstandingPlanPaymentAttachment,
        outstandingRetentionAttachment: data.outstandingRetentionAttachment,
        budgetPlanItems: myBudgetPlanItem,
      },
      {
        onSuccess: () => {
          router.push(`/budget-plans/${id}/detail`);
          toast('Data created!');
        },
        onError: (error) => {
          console.error('Failed to create data', error);
          setValidationError(error, setError);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

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

  const downloadTemplateExcelMutation = useDownloadTemplateExcel();
  const handleDownloadTemplate = (feature: string) => {
    downloadTemplateExcelMutation.mutate(
      { feature },
      {
        onSuccess: () => {
          toast('Excel Template file downloaded successfully!');
        },
        onError: (error) => {
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

  const columns: Column<ItemOfBudgetPlanItemForm>[] = [
    { Header: 'Catalog', accessor: 'catalog' },
    { Header: 'Item', accessor: 'items' },
    { Header: 'ID Asset Group', accessor: 'idAssetGroup' },
    { Header: 'ID Capex Catalog', accessor: 'idCapexCatalog' },
    { Header: 'Currency Rate', accessor: 'currencyRate' },
    { Header: 'id', accessor: 'id' },
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
  ];

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Budget Plan Items Create"
    >
      <Panel>
        <Form onSubmit={handleSubmit(submitCreateBudgetPlanItems)}>
          <Row>
            <SimpleTable
              classTable="table-admin table-inherit"
              columns={columns}
              items={myBudgetPlanItem}
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
                      defaultValue={false}
                    ></Checkbox>
                  </div>
                  {watchIsBuilding ? (
                    <IsBuildingBudgetPlanItemModal
                      onSend={(data) =>
                        setMyBudgetPlanItem((prev) => [...prev, data])
                      }
                    ></IsBuildingBudgetPlanItemModal>
                  ) : (
                    <NonBuildingBudgetPlanItemModal
                      onSend={(data) =>
                        setMyBudgetPlanItem((prev) => [...prev, data])
                      }
                    ></NonBuildingBudgetPlanItemModal>
                  )}
                </div>
              }
              actions={
                <>
                  <Button
                    variant="red"
                    size="sm"
                    className="mr-2"
                    onClick={handleDeleteMultipleMyBudgetPlanItem}
                  >
                    Delete
                  </Button>
                </>
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
              disabled={
                mutationCreateBudgetPlanItems.isLoading ||
                myBudgetPlanItem.length === 0
              }
              isLoading={mutationCreateBudgetPlanItems.isLoading}
            >
              Create
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default CreatePeriodActual;
