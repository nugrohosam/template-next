import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from 'components/form/FileInput';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import PurchaseRequestItemModal from 'components/ui/Modal/PurchaseRequest/PurchaseRequestItemModal';
import SimpleTable from 'components/ui/Table/SimpleTable';
import { Currency } from 'constants/currency';
import { useAssetGroupOptions } from 'modules/assetGroup/helpers';
import { useUploadAttachment } from 'modules/attachment/hook';
import { useFetchBudgetReferences } from 'modules/budgetReference/hook';
import { useBudgetCodeOptions } from 'modules/custom/useBudgetCodeOptions';
import { useCurrencyRate } from 'modules/custom/useCurrencyRate';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { useDeliveryPointOptions } from 'modules/custom/useDeliveryPointOptions';
import { useDistrictOptions } from 'modules/custom/useDistrictOptions';
import { useEmployeeOptions } from 'modules/custom/useEmployeeOptions';
import { useMaterialGroupOptions } from 'modules/custom/useMaterialGroupOptions';
import { useMnemonicOptions } from 'modules/custom/useMnemonicOptions';
import { useSupplierOptions } from 'modules/custom/useSupplierOptions';
import { useUomOptions } from 'modules/custom/useUomOptions';
import { useWarehouseOptions } from 'modules/custom/useWarehouseOptions';
import {
  PurchaseRequestForm,
  PurchaseRequestItem,
} from 'modules/purchaseRequest/entities';
import { useCreatePurchaseRequest } from 'modules/purchaseRequest/hook';
import { useUserOptions } from 'modules/user/helpers';
import moment from 'moment';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from 'react-bootstrap';
import { FieldError, useFieldArray, useForm } from 'react-hook-form';
import { CellProps, Column } from 'react-table';
import { toast } from 'react-toastify';
import {
  formatMoney,
  setValidationError,
  showErrorMessage,
} from 'utils/helpers';
import * as yup from 'yup';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Purchase Request',
    link: '/purchase-requests',
  },
  {
    label: 'Create',
    active: true,
  },
];

const schema = yup.object().shape({
  dateRequired: yup.string().required(`Date required can't be empty`),
  idCapexAssetGroup: yup.string().required(`Asset Group can't be empty`),
  districtCode: yup.string().required(`District can't be empty`),
  idBudgetReference: yup.string().required(`Budget Reference can't be empty`),
  coa: yup.string().required(`COA can't be empty`),
  deliveryPoint: yup.string().required(`Delivery Point can't be empty`),
  warehouse: yup.string().required(`Warehouse Point can't be empty`),
  supplierRecommendation: yup
    .string()
    .required(`Supplier Recommendation can't be empty`),
  quantityRequired: yup
    .number()
    .min(1, 'Quantity must be greater than 0')
    .typeError(`Quantity Required can't be empty`)
    .required(`Quantity Required can't be empty`),
  description: yup.string().required(`Description can't be empty`),
  purchaser: yup.string().required(`Purchaser can't be empty`),
  deliveryInstruction: yup
    .string()
    .required(`Delivery Instruction can't be empty`),
  authorizedBy: yup.string().required(`Authorizer can't be empty`),
  materialGroup: yup
    .string()
    .required(`Material Group Required can't be empty`),
  picAsset: yup.string().required(`PIC Asset Required can't be empty`),
  warrantyHoldPayment: yup
    .string()
    .required(`Warranty Hold Payment Required can't be empty`),
  uom: yup.string().required(`UOM Required can't be empty`),
  districtCodePembebanan: yup
    .string()
    .required(`District Pembebanan Required can't be empty`),
});

const CreatePurchaseRequest: NextPage = () => {
  const router = useRouter();
  const [profile] = useDecodeToken();
  const assetGroupOptions = useAssetGroupOptions();
  const [districtCodeOptions] = useDistrictOptions();
  const [budgetRefOptions] = useBudgetCodeOptions();
  const [deliveryPointOptions] = useDeliveryPointOptions();
  const [warehouseOptions] = useWarehouseOptions();
  const [materialGroupOptions] = useMaterialGroupOptions();
  const [uomOptions] = useUomOptions();
  const [mnemonicOptions] = useMnemonicOptions();
  const [employeeOptions] = useEmployeeOptions();
  const [supplierOptions] = useSupplierOptions();
  const { userOptions: picAssetOptions } = useUserOptions({
    type: 'dept pic asset',
  });
  const { currencyRate } = useCurrencyRate();
  const budgetReferencesHook = useFetchBudgetReferences({
    pageNumber: 1,
    pageSize: 50,
  });

  const {
    handleSubmit,
    clearErrors,
    control,
    getValues,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PurchaseRequestForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [submitStatus, setSubmitStatus] = useState('DRAFT');
  const [isAttachmentUploaded, setIsAttachmentUploaded] = useState(false);
  const [supplierRegistered, setSupplierRegistered] = useState(true);
  const [budgetRefDetail, setBudgetRefDetail] = useState({
    description: '',
    currency: '',
    budgetAmountBalance: 0,
  });

  const uploadAttachmentMutation = useUploadAttachment();
  const handleUploadAttachment = (name: keyof PurchaseRequestForm) => {
    const file = getValues(name);
    const formData = new FormData();
    formData.append('module', 'pr capex');
    if (file) {
      formData.append('attachment', (file as Array<File>)[0]);
    }

    uploadAttachmentMutation.mutate(formData, {
      onSuccess: (data) => {
        toast('Data uploaded!');
        setValue('attachment', data.name);
        setIsAttachmentUploaded(true);
      },
      onError: (error) => {
        setIsAttachmentUploaded(false);
        setValidationError(error, setError);
        toast(error.message, { autoClose: false });
      },
    });
  };

  const createPurchaseRequestMutation = useCreatePurchaseRequest();
  const handleSubmitForm = (data: PurchaseRequestForm) => {
    if (watch('attachment') && !isAttachmentUploaded) {
      toast('Upload the attachment file!', { type: 'error', autoClose: false });
    } else if (fields.length === 0) {
      toast('Minimum 1 item required!', { type: 'error', autoClose: false });
    } else {
      createPurchaseRequestMutation.mutate(
        {
          ...data,
          status: submitStatus,
          supplierRecommendation: supplierRegistered
            ? data.supplierRecommendation
            : '',
          supplierRecommendationName: supplierRegistered
            ? ''
            : data.supplierRecommendation,
          estimatedPriceUsd: watchData().estimatedPrice,
          currencyRate,
          items: fields,
        },
        {
          onSuccess: () => {
            router.push(`/purchase-requests`);
            toast('Data created!');
          },
          onError: (error) => {
            console.error('Failed to create data', error);
            setValidationError(error, setError);
            toast(error.message, { type: 'error', autoClose: false });
            showErrorMessage(error);
          },
        }
      );
    }
  };

  useEffect(() => {
    reset({
      districtCode:
        profile?.district_code !== 'JIEP' ? profile?.district_code : '',
      prDate: moment(new Date()).format('YYYY-MM-DD'),
      requestedBy: profile?.user_id,
      estimatedPriceUsd: 0,
      status: 'DRAFT',
    });
  }, [profile, reset]);

  const watchData = () => {
    const watchForm = watch();

    const price =
      (watchForm.budgetAmountBalance / watchForm.budgetQtyBalance) *
      watchForm.quantityRequired;

    const estimatedPrice =
      watchForm.currency === Currency.Idr ? price / currencyRate : price;

    const totalQtyItems = fields
      .filter((item) => item.quantity)
      .map((item) => item.quantity)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    const availableQty = watchForm.quantityRequired - totalQtyItems;

    const totalUsdItems = fields
      .filter((item) => item.priceUsd)
      .map((item) => item.priceUsd)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    const availableUsd = estimatedPrice - totalUsdItems;

    return { estimatedPrice, availableQty, availableUsd };
  };

  const budgetCodeSelected = (id: string) => {
    const budgetReference = budgetReferencesHook?.data?.items.find(
      (item) => item.id === id
    );

    if (budgetReference) {
      setValue('departmentCode', budgetReference?.departmentCode);
      setValue('currency', budgetReference?.currency);
      setValue('budgetQtyBalance', budgetReference?.qty);
      setValue('budgetAmountBalance', budgetReference?.currentBalance);
      setBudgetRefDetail({
        description: budgetReference.description || '-',
        currency: budgetReference?.currency || '',
        budgetAmountBalance: budgetReference?.currentBalance,
      });
    }
  };

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: 'items',
  });

  const columns: Column<PurchaseRequestItem>[] = [
    {
      Header: 'Actions',
      Cell: ({ row }: CellProps<PurchaseRequestItem>) => (
        <div style={{ minWidth: 100 }}>
          <PurchaseRequestItemModal
            onSend={(data) => update(row.index, data)}
            isEdit={true}
            buttonTitle="Edit"
            myItem={row.values as PurchaseRequestItem}
            itemData={{
              description1: budgetRefDetail.description,
              uomOptions,
              mnemonicOptions,
              availableQty: watchData().availableQty,
              availableUsd: watchData().availableUsd.toFixed(2),
            }}
          ></PurchaseRequestItemModal>
        </div>
      ),
    },
    { Header: 'Item', accessor: 'item' },
    { Header: 'Description 1', accessor: 'description_1' },
    { Header: 'Description 2', accessor: 'description_2' },
    { Header: 'Description 3', accessor: 'description_3' },
    { Header: 'Description 4', accessor: 'description_4' },
    { Header: 'Part No', accessor: 'partNo' },
    { Header: 'Mnemonic', accessor: 'mnemonic' },
    { Header: 'Uom', accessor: 'uom' },
    { Header: 'Quantity', accessor: 'quantity' },
    {
      Header: 'Price (USD)',
      accessor: 'priceUsd',
      Cell: ({ row }: CellProps<PurchaseRequestItem>) =>
        formatMoney(row.values.priceUsd, Currency.Usd, '-'),
    },
  ];

  return (
    <DetailLayout
      title="Create Purchase Request"
      backButtonClick={router.back}
      paths={breadCrumb}
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">PR Date</FormLabel>
                <Input
                  name="prDate"
                  control={control}
                  defaultValue=""
                  type="date"
                  error={errors.prDate?.message}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Request By</FormLabel>
                <Input
                  name="requestedBy"
                  control={control}
                  defaultValue=""
                  type="text"
                  error={errors.requestedBy?.message}
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Date Required</FormLabel>
                <Input
                  name="dateRequired"
                  control={control}
                  defaultValue=""
                  type="date"
                  placeholder="Date Required"
                  error={errors.dateRequired?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Asset Group</FormLabel>
                <SingleSelect
                  name="idCapexAssetGroup"
                  control={control}
                  defaultValue=""
                  placeholder="Asset Group"
                  options={assetGroupOptions}
                  error={errors.idCapexAssetGroup?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">District</FormLabel>
                <SingleSelect
                  name="districtCode"
                  control={control}
                  defaultValue=""
                  placeholder="District"
                  options={districtCodeOptions}
                  error={errors.districtCode?.message}
                  isDisabled={profile?.district_code !== 'JIEP'}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Department</FormLabel>
                <Input
                  name="departmentCode"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Department"
                  error={errors.departmentCode?.message}
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Delivery Point</FormLabel>
                <SingleSelect
                  name="deliveryPoint"
                  control={control}
                  defaultValue=""
                  placeholder="Delivery Point"
                  options={deliveryPointOptions}
                  error={errors.deliveryPoint?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Budget Reference</FormLabel>
                <SingleSelect
                  name="idBudgetReference"
                  control={control}
                  defaultValue=""
                  placeholder="Budget Reference"
                  options={budgetRefOptions}
                  onChange={(val) => {
                    budgetCodeSelected(val?.value as string);
                  }}
                  error={errors.idBudgetReference?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">COA</FormLabel>
                <SingleSelect
                  name="coa"
                  control={control}
                  defaultValue=""
                  placeholder="COA"
                  options={[
                    { label: 'X47000', value: 'X47000' },
                    { label: '470010', value: '470010' },
                    { label: '470020', value: '470020' },
                    { label: '470030', value: '470030' },
                  ]}
                  error={errors.coa?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">
                  Budget Reference Description
                </FormLabel>
                <FormControl disabled value={budgetRefDetail.description} />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Warehouse</FormLabel>
                <SingleSelect
                  name="warehouse"
                  control={control}
                  defaultValue=""
                  placeholder="Warehouse"
                  options={warehouseOptions}
                  error={errors.warehouse?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Balance (Qty)</FormLabel>
                <Input
                  name="budgetQtyBalance"
                  control={control}
                  defaultValue=""
                  type="number"
                  placeholder="Balance (Qty)"
                  error={errors.budgetQtyBalance?.message}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Currency</FormLabel>
                <Input
                  name="currency"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Currency"
                  error={errors.currency?.message}
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Balance (Amount)</FormLabel>
                <FormControl
                  type="text"
                  value={formatMoney(
                    budgetRefDetail.budgetAmountBalance,
                    budgetRefDetail.currency as Currency
                  )}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">
                  Supplier Recommendation
                </FormLabel>
                {!supplierRegistered && (
                  <Input
                    name="supplierRecommendation"
                    control={control}
                    defaultValue=""
                    type="text"
                    placeholder="Supplier Name"
                    error={errors.supplierRecommendation?.message}
                  />
                )}
                {supplierRegistered && (
                  <SingleSelect
                    name="supplierRecommendation"
                    control={control}
                    defaultValue=""
                    placeholder="Supplier Recommendation"
                    options={supplierOptions}
                    error={errors.supplierRecommendation?.message}
                  />
                )}
                <div className="custom-control custom-checkbox mt-2 d-flex justify-content-end">
                  <input
                    id="supplierRegistered"
                    type="checkbox"
                    className="custom-control-input"
                    checked={!supplierRegistered}
                    onChange={(event) => {
                      setValue('supplierRecommendation', '');
                      setSupplierRegistered(!event.target.checked);
                    }}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="supplierRegistered"
                  >
                    Supplier Not Registered
                  </label>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Quantity Required</FormLabel>
                <Input
                  name="quantityRequired"
                  control={control}
                  defaultValue=""
                  type="number"
                  placeholder="Quantity Required"
                  error={errors.quantityRequired?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Estimate Price (USD)</FormLabel>
                <FormControl
                  type="text"
                  value={formatMoney(watchData().estimatedPrice, Currency.Usd)}
                  disabled
                />
                <small>
                  Currency rate: {formatMoney(currencyRate, Currency.Idr)}
                </small>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <FormGroup>
                <FormLabel className="required">Description</FormLabel>
                <Input
                  as="textarea"
                  name="description"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Description"
                  error={errors.description?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Purchaser</FormLabel>
                <SingleSelect
                  name="purchaser"
                  control={control}
                  defaultValue=""
                  placeholder="Purchaser"
                  // TODO: positionId = purchaser (?)
                  options={employeeOptions}
                  error={errors.purchaser?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Delivery Instruction</FormLabel>
                <Input
                  name="deliveryInstruction"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Delivery Instruction"
                  error={errors.deliveryInstruction?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Authorized By</FormLabel>
                <SingleSelect
                  name="authorizedBy"
                  control={control}
                  defaultValue=""
                  placeholder="Authorized By"
                  options={employeeOptions}
                  error={errors.authorizedBy?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Material Group</FormLabel>
                <SingleSelect
                  name="materialGroup"
                  control={control}
                  defaultValue=""
                  placeholder="Material Group"
                  options={materialGroupOptions}
                  error={errors.materialGroup?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">PIC Asset</FormLabel>
                <SingleSelect
                  name="picAsset"
                  control={control}
                  defaultValue=""
                  placeholder="PIC Asset"
                  options={picAssetOptions}
                  error={errors.picAsset?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">
                  Warranty Hold Payment
                </FormLabel>
                <SingleSelect
                  name="warrantyHoldPayment"
                  control={control}
                  defaultValue=""
                  placeholder="Warranty Hold Payment"
                  options={[
                    { label: 'YES', value: 'YES' },
                    { label: 'NO', value: 'NO' },
                  ]}
                  error={errors.warrantyHoldPayment?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">UOM</FormLabel>
                <SingleSelect
                  name="uom"
                  control={control}
                  defaultValue=""
                  placeholder="UOM"
                  options={uomOptions}
                  error={errors.uom?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">District Pembebanan</FormLabel>
                <SingleSelect
                  name="districtCodePembebanan"
                  control={control}
                  defaultValue=""
                  placeholder="District Pembebanan"
                  options={districtCodeOptions}
                  error={errors.districtCodePembebanan?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Attachment File</FormLabel>
                <FileInput
                  name="attachment"
                  control={control}
                  placeholder="Upload Attachment File"
                  error={(errors.attachment as FieldError)?.message}
                />
                <Button
                  variant="link"
                  className="mt-2 p-0 font-xs"
                  onClick={() => {
                    clearErrors('attachment');
                    handleUploadAttachment('attachment');
                  }}
                >
                  <p>Upload</p>
                </Button>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <SimpleTable
                classTable="table-admin table-inherit"
                columns={columns}
                items={fields}
                selectedRows={selectedRow}
                onSelectedRowsChanged={(rows) => setSelectedRow(rows)}
                actions={
                  <>
                    <Button
                      variant="red"
                      size="sm"
                      className="mr-2"
                      onClick={() =>
                        remove(
                          Object.keys(selectedRow).map((item) => parseInt(item))
                        )
                      }
                    >
                      Delete
                    </Button>
                  </>
                }
              />
            </Col>
            <Col lg={12}>
              <PurchaseRequestItemModal
                onSend={append}
                classButton="mt-4"
                buttonTitle="+ Add Item"
                itemData={{
                  description1: budgetRefDetail.description,
                  uomOptions,
                  mnemonicOptions,
                  availableQty: watchData().availableQty,
                  availableUsd: watchData().availableUsd.toFixed(2),
                }}
              />
            </Col>
          </Row>
          <Col lg={12} className="d-flex pr-sm-0 justify-content-end mt-5">
            <LoadingButton
              variant="primary"
              type="submit"
              className="mr-2"
              isLoading={createPurchaseRequestMutation.isLoading}
              disabled={!isValid || createPurchaseRequestMutation.isLoading}
              onClick={() => setSubmitStatus('DRAFT')}
            >
              Save
            </LoadingButton>
            <LoadingButton
              variant="green"
              type="submit"
              isLoading={createPurchaseRequestMutation.isLoading}
              disabled={!isValid || createPurchaseRequestMutation.isLoading}
              onClick={() => setSubmitStatus('SUBMIT')}
            >
              Submit
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default CreatePurchaseRequest;
