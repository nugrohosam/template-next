import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from 'components/form/FileInput';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { useAttachmentHelpers } from 'modules/attachment/helpers';
import { useUploadAttachment } from 'modules/attachment/hook';
import { useFetchBudgetReferences } from 'modules/budgetReference/hook';
import { useBudgetCodeOptions } from 'modules/custom/useBudgetCodeOptions';
import { OverBudgetForm } from 'modules/overbudget/entities';
import {
  useFetchOverBudgetDetail,
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
import { setValidationError, showErrorMessage } from 'utils/helpers';
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
  currentBalance: yup.string().required(`Current Balance can't be empty`),
  additionalBudgetPerUnit: yup
    .string()
    .required(`Additional Budget/Unit can't be empty`),
  overbudget: yup.string().required(`Over Budget can't be empty`),
  background: yup.string().required(`Background can't be empty`),
  impactIfNotRealized: yup
    .string()
    .required(`Impact If Not Realized can't be empty`),
});

const EditOverBudget: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [budgetCodeOptions] = useBudgetCodeOptions();
  const { handleDownloadAttachment } = useAttachmentHelpers();
  const { data: dataHook } = useFetchOverBudgetDetail(id);

  const budgetReferencesHook = useFetchBudgetReferences({
    pageNumber: 1,
    pageSize: 50,
  });

  const [budgetRefDetail, setBudgetRefDetail] = useState({
    description: '',
    quantity: '',
    currency: '',
    pricePerUnit: '',
  });
  const [isAttachmentUploaded, setIsAttachmentUploaded] = useState(false);

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
  } = useForm<OverBudgetForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const mutation = useUpdateOverbudget();
  const handleSubmitForm = (data: OverBudgetForm) => {
    if (watch('attachment') !== dataHook?.attachment && !isAttachmentUploaded) {
      toast('Upload the attachment file!', { type: 'error', autoClose: false });
    } else {
      mutation.mutate(
        { idOverbudget: id, data },
        {
          onSuccess: () => {
            router.push('/overbudgets');
            toast('Data updated!');
          },
          onError: (error) => {
            console.log('Failed to update data', error);
            setValidationError(error, setError);
            toast(error.message, { autoClose: false });
            showErrorMessage(error);
          },
        }
      );
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
    // TODO: beberapa atribut belum di-provide API
    setBudgetRefDetail({
      description: 'Budget Reference Description',
      quantity: dataHook?.quantity.toString() || '',
      currency: dataHook?.budgetReference?.currency || '',
      pricePerUnit: '100000',
    });
  }, [dataHook, reset]);

  const uploadAttachmentMutation = useUploadAttachment();
  const handleUploadAttachment = (name: keyof OverBudgetForm) => {
    const file = getValues(name);
    const formData = new FormData();
    formData.append('module', 'overbudget');
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

  const budgetCodeSelected = (id: string) => {
    const budgetReference = budgetReferencesHook?.data?.items.find(
      (item) => item.id === id
    );

    if (budgetReference) {
      setValue('currentBalance', budgetReference?.currentBalance);
      // TODO: beberapa atribut belum di-provide API
      setBudgetRefDetail({
        description: 'Budget Reference Description',
        quantity: '3',
        currency: budgetReference?.currency,
        pricePerUnit: '100000',
      });
    }
  };

  const additionalBudget = watch('additionalBudgetPerUnit');
  useEffect(() => {
    if (additionalBudget) {
      setValue(
        'overbudget',
        parseInt(budgetRefDetail.quantity) * additionalBudget
      );
    }
  });

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
                <Input
                  type="number"
                  name="currentBalance"
                  control={control}
                  defaultValue=""
                  placeholder="Current Balance"
                  disabled
                  error={errors.currentBalance?.message}
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
                <Input
                  type="number"
                  name="overbudget"
                  control={control}
                  defaultValue=""
                  disabled
                  error={errors.overbudget?.message}
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
                  name="attachment"
                  control={control}
                  placeholder="Upload Attachment File"
                  defaultValue={dataHook?.attachment}
                  error={(errors.attachment as FieldError)?.message}
                />
                <div className="d-flex flex-row">
                  <Button
                    variant="link"
                    className="mt-2 p-0 font-xs"
                    onClick={() => {
                      clearErrors('attachment');
                      handleUploadAttachment('attachment');
                    }}
                  >
                    <p>Upload</p>
                  </Button>{' '}
                  <div className="mt-1">|</div>
                  <Button
                    size="sm"
                    variant="link"
                    className="mt-2 p-0 font-xs"
                    onClick={() =>
                      handleDownloadAttachment({
                        fileName: dataHook?.attachment || '',
                        module: 'overbudget',
                      })
                    }
                  >
                    <p>{dataHook?.attachment}</p>
                  </Button>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Col lg={12} className="d-flex pr-sm-0 justify-content-end">
            <LoadingButton
              variant="primary"
              type="submit"
              isLoading={mutation.isLoading}
              disabled={!isValid || mutation.isLoading}
            >
              Update
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default EditOverBudget;
