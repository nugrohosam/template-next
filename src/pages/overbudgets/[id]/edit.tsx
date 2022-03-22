import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from 'components/form/FileInput';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { Currency } from 'constants/currency';
import { useAttachmentHelpers } from 'modules/attachment/helpers';
import { useUploadAttachment } from 'modules/attachment/hook';
import { useFetchBudgetReferences } from 'modules/budgetReference/hook';
import { useBudgetCodeOptions } from 'modules/custom/useBudgetCodeOptions';
import { OverbudgetStatus } from 'modules/overbudget/constant';
import { OverbudgetForm } from 'modules/overbudget/entities';
import { useOverbudgetHelpers } from 'modules/overbudget/helpers';
import {
  useFetchOverbudgetDetail,
  useUpdateOverbudget,
} from 'modules/overbudget/hook';
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
    label: 'Overbudget',
    link: '/overbudgets',
  },
  {
    label: 'Edit',
    active: true,
  },
];

const schema = yup.object().shape({
  idBudgetReference: yup.string().required(`Budget Code can't be empty`),
  currentBalance: yup
    .number()
    .typeError(`Current Balance can't be empty`)
    .required(`Current Balance can't be empty`),
  additionalBudgetPerUnit: yup
    .number()
    .typeError(`Additional Budget/Unit can't be empty`)
    .required(`Additional Budget/Unit can't be empty`),
  overbudget: yup
    .number()
    .typeError(`Over Budget can't be empty`)
    .required(`Over Budget can't be empty`),
  background: yup.string().required(`Background can't be empty`),
  impactIfNotRealized: yup
    .string()
    .required(`Impact If Not Realized can't be empty`),
});

const EditOverbudget: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [budgetCodeOptions] = useBudgetCodeOptions();
  const { handleDownloadAttachment } = useAttachmentHelpers();
  const { data: dataHook } = useFetchOverbudgetDetail(id);

  const budgetReferencesHook = useFetchBudgetReferences({
    pageNumber: 1,
    pageSize: 50,
  });

  const [budgetRefDetail, setBudgetRefDetail] = useState({
    description: '',
    quantity: 0,
    currency: '',
    pricePerUnit: '',
  });
  const [isAttachmentUploaded, setIsAttachmentUploaded] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(OverbudgetStatus.Draft);

  const {
    handleSubmit,
    control,
    clearErrors,
    getValues,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OverbudgetForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const {
    currentBalance: watchCurrentBalance,
    overbudget: watchOverbudget,
    additionalBudgetPerUnit: watchAdditionalBudgetPerUnit,
    attachmentFile: watchAttachmentFile,
  } = watch();

  const { mutationUpdateOverbudget, handleUpdateOverbudget } =
    useOverbudgetHelpers();
  const handleSubmitForm = (data: OverbudgetForm) => {
    if (watchAttachmentFile && !isAttachmentUploaded) {
      toast('Upload the attachment file!', { type: 'error', autoClose: false });
    } else {
      delete data.attachmentFile;
      data.status = submitStatus;

      handleUpdateOverbudget(id, data)
        .then(() => router.push(`/overbudgets/${id}/detail`))
        .catch((error) => setValidationError(error, setError));
    }
  };

  useEffect(() => {
    reset({
      idBudgetReference: dataHook?.budgetReference.id,
      currentBalance: dataHook?.currentBalance,
      additionalBudgetPerUnit: dataHook?.additionalBudgetPerUnit,
      overbudget: dataHook?.overBudget,
      background: dataHook?.background,
      impactIfNotRealized: dataHook?.impactIfNotRealized,
      attachment: dataHook?.attachment,
      status: dataHook?.status,
    });
    setBudgetRefDetail({
      description: dataHook?.budgetReference?.description || '-',
      quantity: dataHook?.budgetReference?.qty || 0,
      currency: dataHook?.budgetReference?.currency || '',
      pricePerUnit: formatMoney(
        dataHook?.budgetReference?.pricePerUnit,
        dataHook?.budgetReference?.currency
      ).toString(),
    });
  }, [dataHook, reset]);

  const { handleUploadAttachment } = useAttachmentHelpers();
  const uploadAttachment = (attachment: keyof OverbudgetForm) => {
    const file = getValues(`${attachment}File` as keyof OverbudgetForm);
    handleUploadAttachment(file as File[], 'overbudget')
      .then((result) => {
        setValue(attachment, result.name);
        setIsAttachmentUploaded(true);
      })
      .catch((error) => {
        setValidationError(error, setError);
        setIsAttachmentUploaded(false);
      });
  };

  const budgetCodeSelected = (id: string) => {
    const budgetReference = budgetReferencesHook?.data?.items.find(
      (item) => item.id === id
    );

    if (budgetReference) {
      setValue('currentBalance', budgetReference?.currentBalance);
      setBudgetRefDetail({
        description: budgetReference?.description || '-',
        quantity: budgetReference?.qty,
        currency: budgetReference?.currency,
        pricePerUnit: formatMoney(
          budgetReference?.pricePerUnit,
          budgetReference?.currency
        ).toString(),
      });
    }
  };

  useEffect(() => {
    if (watchAdditionalBudgetPerUnit) {
      setValue(
        'overbudget',
        budgetRefDetail.quantity * watchAdditionalBudgetPerUnit
      );
    }
  }, [budgetRefDetail.quantity, setValue, watchAdditionalBudgetPerUnit]);

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Create Overbudget"
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Budget Code</FormLabel>
                <SingleSelect
                  control={control}
                  name="idBudgetReference"
                  placeholder="Choose Budget Code"
                  options={budgetCodeOptions}
                  onChange={(val) => {
                    budgetCodeSelected(val?.value as string);
                  }}
                  error={errors.idBudgetReference?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Current Balance</FormLabel>
                <FormControl
                  disabled
                  type="text"
                  value={
                    formatMoney(
                      watchCurrentBalance,
                      budgetRefDetail.currency as Currency
                    ) || ''
                  }
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Description</FormLabel>
                <FormControl disabled value={budgetRefDetail.description} />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Quantity</FormLabel>
                <FormControl disabled value={budgetRefDetail.quantity} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Currency</FormLabel>
                <FormControl disabled value={budgetRefDetail.currency} />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Price Per Unit</FormLabel>
                <FormControl disabled value={budgetRefDetail.pricePerUnit} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">
                  Additional Budget/Unit
                </FormLabel>
                <Input
                  type="number"
                  name="additionalBudgetPerUnit"
                  control={control}
                  defaultValue=""
                  placeholder="Additional Budget/Unit"
                  error={errors.additionalBudgetPerUnit?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Over Budget</FormLabel>
                <FormControl
                  disabled
                  type="text"
                  value={
                    formatMoney(
                      watchOverbudget,
                      budgetRefDetail.currency as Currency
                    ) || '0'
                  }
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <FormGroup>
                <FormLabel className="required">
                  Latar Belakang Kebutuhan Capex
                </FormLabel>
                <Input
                  as="textarea"
                  type="text"
                  name="background"
                  control={control}
                  defaultValue=""
                  error={errors.background?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <FormGroup>
                <FormLabel className="required">
                  Dampak Jika Tidak Realisasi
                </FormLabel>
                <Input
                  as="textarea"
                  type="text"
                  name="impactIfNotRealized"
                  control={control}
                  defaultValue=""
                  error={errors.impactIfNotRealized?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Attachment File</FormLabel>
                <FileInput
                  name="attachmentFile"
                  control={control}
                  placeholder="Upload Attachment File"
                  defaultValue={dataHook?.attachment}
                  error={(errors.attachment as FieldError)?.message}
                />
                <div className="d-flex flex-row">
                  <Button
                    variant="link"
                    className="mt-2 p-0 font-xs"
                    disabled={!!!watchAttachmentFile}
                    onClick={() => {
                      clearErrors('attachment');
                      uploadAttachment('attachment');
                    }}
                  >
                    <p>Upload</p>
                  </Button>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Col lg={12} className="d-flex pr-sm-0 justify-content-end">
            <LoadingButton
              variant="primary"
              type="submit"
              className="mr-2"
              isLoading={
                mutationUpdateOverbudget.isLoading &&
                submitStatus === OverbudgetStatus.Draft
              }
              disabled={!isValid || mutationUpdateOverbudget.isLoading}
              onClick={() => setSubmitStatus(OverbudgetStatus.Draft)}
            >
              Save
            </LoadingButton>
            <LoadingButton
              variant="green"
              type="submit"
              isLoading={
                mutationUpdateOverbudget.isLoading &&
                submitStatus === OverbudgetStatus.Submit
              }
              disabled={!isValid || mutationUpdateOverbudget.isLoading}
              onClick={() => setSubmitStatus(OverbudgetStatus.Submit)}
            >
              Submit
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default EditOverbudget;
