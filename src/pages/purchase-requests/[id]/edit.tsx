import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from 'components/form/FileInput';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
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
import { PurchaseRequestForm } from 'modules/purchaseRequest/entities';
import { useUserOptions } from 'modules/user/helpers';
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
import { FieldError, useForm } from 'react-hook-form';
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
    link: '/purchase-request',
  },
  {
    label: 'Edit',
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

const EditPurchaseRequest: NextPage = () => {
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

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Edit Purchase Request"
    >
      <Panel>
        <Form>
          <Col lg={6}></Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default EditPurchaseRequest;
