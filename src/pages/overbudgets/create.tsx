import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from 'components/form/FileInput';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { OverBudgetStatus } from 'constants/status';
import { useUploadAttachment } from 'modules/attachment/hook';
import { useFetchBudgetReferences } from 'modules/budgetReference/hook';
import { useBudgetCodeOptions } from 'modules/custom/useBudgetCodeOptions';
import { OverBudgetForm } from 'modules/overbudget/entities';
import { useCreateOverBudget } from 'modules/overbudget/hook';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CSSProperties, useEffect, useState } from 'react';
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
    label: 'Create',
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
  attachment: yup.mixed().required(`Attachment File can't be empty`),
});

const CreateOverBudget: NextPage = () => {
  const router = useRouter();
  const [budgetCodeOptions] = useBudgetCodeOptions();

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
  const [submitStatus, setSubmitStatus] = useState(OverBudgetStatus.DRAFT);

  const {
    handleSubmit,
    control,
    clearErrors,
    getValues,
    setError,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OverBudgetForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

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
        setIsAttachmentUploaded(true); // TODO: set to false, masih set true karena module upload overbudget belum ready
        setValue('attachment', 'attachment_overbudget.pdf');
        setValidationError(error, setError);
        toast(error.message, { autoClose: false });
      },
    });
  };

  const createOverBudgetMutation = useCreateOverBudget();
  const handleSubmitForm = (data: OverBudgetForm) => {
    if (isAttachmentUploaded) {
      createOverBudgetMutation.mutate(
        {
          ...data,
          status: submitStatus,
        },
        {
          onSuccess: () => {
            router.push(`/overbudgets`);
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
    } else {
      toast('Upload the attachment file!', { type: 'error', autoClose: false });
    }
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
                <FormLabel className="required">Attachment File</FormLabel>
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
          <Col lg={12} className="d-flex pr-sm-0 justify-content-end">
            <LoadingButton
              variant="primary"
              type="submit"
              className="mr-2"
              isLoading={createOverBudgetMutation.isLoading}
              disabled={!isValid || createOverBudgetMutation.isLoading}
              onClick={() => setSubmitStatus(OverBudgetStatus.DRAFT)}
            >
              Save
            </LoadingButton>
            <LoadingButton
              variant="success"
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                letterSpacing: '1.5px',
                lineHeight: '16px',
              }}
              type="submit"
              isLoading={createOverBudgetMutation.isLoading}
              disabled={!isValid || createOverBudgetMutation.isLoading}
              onClick={() => setSubmitStatus(OverBudgetStatus.SUBMIT)}
            >
              Submit
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default CreateOverBudget;
