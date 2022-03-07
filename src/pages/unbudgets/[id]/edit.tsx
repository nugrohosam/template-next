import { yupResolver } from '@hookform/resolvers/yup';
import Checkbox from 'components/form/Checkbox';
import FileInput from 'components/form/FileInput';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import UnbudgetModal from 'components/ui/Modal/Unbudget/UnbudgetModal';
import SimpleTable from 'components/ui/Table/SimpleTable';
import { PeriodeType } from 'constants/period';
import { useAttachmentHelpers } from 'modules/attachment/helpers';
import { getValueItemByMonth } from 'modules/budgetPlanItem/helpers';
import { useDownloadTemplateHelpers } from 'modules/downloadTemplate/helpers';
import {
  BudgetPlanItemOfUnbudgetForm,
  UnbudgetForm,
} from 'modules/unbudget/entities';
import { useUnbudgetHelpers } from 'modules/unbudget/helpers';
import {
  useFetchUnbudgetDetail,
  useFetchUnbudgetItems,
} from 'modules/unbudget/hook';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { FieldError, useFieldArray, useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import { setValidationError } from 'utils/helpers';
import * as yup from 'yup';

// TODO: period masih hardcode
const periodNow = PeriodeType.Mb;

const schema = yup.object().shape({
  unbudgetBackground: yup.string().required(),
  unbudgetImpactIfNotRealized: yup.string().required(),
  unbudgetAttachment: yup.string().required(),
});

const EditUnbudget: NextPage = () => {
  const router = useRouter();
  const idUnbudget = router.query.id as string;

  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});

  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Detail Unbudget',
      link: `/unbudgets/${idUnbudget}/detail`,
    },
    {
      label: 'Edit',
      active: true,
    },
  ];

  const {
    control,
    watch,
    setError,
    formState: { errors, isValid },
    handleSubmit,
    clearErrors,
    setValue,
    getValues,
    reset,
    resetField,
  } = useForm<UnbudgetForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    delayError: 500,
    defaultValues: {
      outstandingPlanPaymentAttachment: null,
      outstandingRetentionAttachment: null,
    },
  });
  const { fields, remove, append, replace } = useFieldArray({
    control,
    name: 'budgetPlanItems',
  });
  const {
    isBuilding: watchIsBuilding,
    budgetPlanItems: watchBudgetPlanItems,
    unbudgetAttachmentFile: watchUnbudgetAttachmentFile,
    outstandingPlanPaymentAttachmentFile:
      watchOutstandingPlanPaymentAttachmentFile,
    outstandingRetentionAttachmentFile: watchOutstandingRetentionAttachmentFile,
  } = watch();
  const controlledFields = fields.map(
    (field, index) => watchBudgetPlanItems[index]
  );

  useEffect(() => {
    replace([]);
    resetField('outstandingPlanPaymentAttachment');
    resetField('outstandingPlanPaymentAttachmentFile');
    resetField('outstandingRetentionAttachment');
    resetField('outstandingRetentionAttachmentFile');
  }, [replace, resetField, watchIsBuilding]);

  const dataHookUnbudgetDetail = useFetchUnbudgetDetail(idUnbudget);
  const dataHookUnbudgetItems = useFetchUnbudgetItems(idUnbudget, {});
  useEffect(() => {
    if (dataHookUnbudgetDetail.data) {
      reset({
        isBuilding: dataHookUnbudgetDetail.data.isBuilding,
        unbudgetBackground: dataHookUnbudgetDetail.data.unbudgetBackground,
        unbudgetImpactIfNotRealized:
          dataHookUnbudgetDetail.data.unbudgetImpactIfNotRealized,
        unbudgetAttachment: dataHookUnbudgetDetail.data.unbudgetAttachment,
        outstandingPlanPaymentAttachment:
          dataHookUnbudgetDetail.data.outstandingPlanPaymentAttachment,
        outstandingRetentionAttachment:
          dataHookUnbudgetDetail.data.outstandingRetentionAttachment,
      });
      replace(dataHookUnbudgetItems.data?.items || []);
    }
  }, [
    dataHookUnbudgetDetail.data,
    dataHookUnbudgetItems.data?.items,
    replace,
    reset,
  ]);

  const { mutationUpdateUnbudget, handleUpdateUnbudget } = useUnbudgetHelpers();
  const submitCreateUnbudget = (data: UnbudgetForm) => {
    delete data.unbudgetAttachmentFile;
    delete data.outstandingPlanPaymentAttachmentFile;
    delete data.outstandingRetentionAttachmentFile;

    handleUpdateUnbudget(idUnbudget, data)
      .then(() => router.push(`/unbudgets/${idUnbudget}/detail`))
      .catch((error) => setValidationError(error, setError));
  };

  const { handleDownloadTemplate } = useDownloadTemplateHelpers();
  const { handleUploadAttachment } = useAttachmentHelpers();
  const uploadAttachment = (attachment: keyof UnbudgetForm) => {
    const file = getValues(`${attachment}File` as keyof UnbudgetForm);
    handleUploadAttachment(file as File[], 'unbudget')
      .then((result) => setValue(attachment, result.name))
      .catch((error) => setValidationError(error, setError));
  };

  const columns: Column<BudgetPlanItemOfUnbudgetForm>[] = [
    { Header: 'Catalog', accessor: 'catalog' },
    { Header: 'Item', accessor: 'items' },
    { Header: 'ID Asset Group', accessor: 'idAssetGroup' },
    { Header: 'Currency Rate', accessor: 'currencyRate' },
    { Header: 'ID', accessor: 'id' },
    {
      Header: 'Detail',
      accessor: 'detail',
      minWidth: 300,
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) =>
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) =>
        row.values.pricePerUnit?.toLocaleString('id-Id') || '-',
    },
    {
      Header: 'Total USD',
      accessor: 'totalAmountUsd',
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) =>
        row.values.totalAmountUsd?.toLocaleString('en-EN') || '-',
    },
    {
      Header: 'Total IDR',
      accessor: 'totalAmount',
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) =>
        row.values.totalAmount?.toLocaleString('id-Id') || '-',
    },
    {
      Header: 'Jan',
      minWidth: 100,
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemOfUnbudgetForm>) => (
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
      title="Edit Unbudget"
    >
      <Panel>
        <Form onSubmit={handleSubmit(submitCreateUnbudget)}>
          <Row>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">District</h4>
              <h3 className="profile-detail__info--subtitle">JIEP</h3>
            </Col>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Divisi</h4>
              <h3 className="profile-detail__info--subtitle">FATB</h3>
            </Col>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Departemen</h4>
              <h3 className="profile-detail__info--subtitle">TREA</h3>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Year</h4>
              <h3 className="profile-detail__info--subtitle">2022</h3>
            </Col>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Period</h4>
              <h3 className="profile-detail__info--subtitle">{periodNow}</h3>
            </Col>
          </Row>

          <br />

          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">
                  Latar Belakang Kebutuhan Capex
                </FormLabel>
                <Input
                  name="unbudgetBackground"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Latar Belakang Kebutuhan Capex"
                  error={errors.unbudgetBackground?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">
                  Dampak Jika Tidak Realisasi
                </FormLabel>
                <Input
                  name="unbudgetImpactIfNotRealized"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Dampak Jika Tidak Realisasi"
                  error={errors.unbudgetImpactIfNotRealized?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Unbudget Attachment</FormLabel>
                <FileInput
                  name="unbudgetAttachmentFile"
                  control={control}
                  placeholder="Upload New File"
                  error={(errors.unbudgetAttachment as FieldError)?.message}
                />
                <Button
                  variant="link"
                  className="mt-2 p-0 font-xs"
                  disabled={!!!watchUnbudgetAttachmentFile}
                  onClick={() => {
                    clearErrors('unbudgetAttachment');
                    uploadAttachment('unbudgetAttachment');
                  }}
                >
                  <p>Upload</p>
                </Button>
              </FormGroup>
            </Col>
          </Row>

          <br />

          <Row>
            <SimpleTable
              classTable="table-admin table-inherit"
              columns={columns}
              items={controlledFields}
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
                      label="Asset Building"
                      name="isBuilding"
                      control={control}
                      defaultValue={false}
                    ></Checkbox>
                  </div>
                  <UnbudgetModal
                    isBuilding={watchIsBuilding}
                    period={periodNow}
                    {...(watchBudgetPlanItems?.length > 0 && {
                      inPageUpdate: {
                        idAssetGroup:
                          watchBudgetPlanItems[0]?.catalog?.assetGroup?.id ||
                          '',
                        currency: watchBudgetPlanItems[0]?.currency,
                      },
                    })}
                    onSend={append}
                  ></UnbudgetModal>
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
                      placeholder="Upload New Excel File"
                      error={
                        (errors.outstandingPlanPaymentAttachment as FieldError)
                          ?.message
                      }
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
                      placeholder="Upload New Excel File"
                      error={
                        (errors.outstandingRetentionAttachment as FieldError)
                          ?.message
                      }
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
              disabled={
                mutationUpdateUnbudget.isLoading ||
                watchBudgetPlanItems?.length === 0
              }
              isLoading={mutationUpdateUnbudget.isLoading}
            >
              Update
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default EditUnbudget;
