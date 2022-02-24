import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from 'components/form/FileInput';
import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { UploadActualYtdReq } from 'modules/actualTyd/entities';
import { useUploadActualYtd } from 'modules/actualTyd/hook';
import { useDownloadTemplateExcel } from 'modules/downloadTemplate/hook';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
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
    label: 'Actual YTD',
    link: '/actual-ytd',
  },
  {
    label: 'Upload',
    active: true,
  },
];

const schema = yup.object().shape({
  file: yup.mixed().required(`File can't be empty`),
  year: yup.string().required(`Year can't be empty`),
  period: yup.string().required(`Period can't be empty`),
});

const UploadActualYtd: NextPage = () => {
  const router = useRouter();
  const uploadMutation = useUploadActualYtd();
  const downloadTemplateExcelMutation = useDownloadTemplateExcel();
  const date = new Date();
  const year = date.getFullYear().toString();
  const period = date.getMonth() <= 6 ? 'S1' : 'S2';

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid },
  } = useForm<UploadActualYtdReq>({
    mode: 'onChange',
    defaultValues: { year, period },
    resolver: yupResolver(schema),
  });

  const handleDownloadTemplate = () => {
    downloadTemplateExcelMutation.mutate(
      { feature: 'actual ytd' },
      {
        onSuccess: () => {
          toast('Excel template file downloaded!');
        },
        onError: (error) => {
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

  const handleSubmitForm = (data: UploadActualYtdReq) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('year', data.year);
    formData.append('period', data.period);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        router.push('/actual-ytd');
        toast('Data uploaded!');
      },
      onError: (error) => {
        setValidationError(error, setError);
        toast(error.message, { autoClose: false });
      },
    });
  };

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Upload Actual YTD"
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Year</FormLabel>
                <FormControl value={year} disabled />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Period</FormLabel>
                <FormControl value={period} disabled />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>File</FormGroup>
              <FileInput
                name="file"
                control={control}
                placeholder="Upload Excel File"
                error={(errors.file as unknown as FieldError)?.message}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Button
                variant="link"
                className="mt-2 p-0 font-xs"
                onClick={handleDownloadTemplate}
              >
                <p>Download Template</p>
              </Button>
            </Col>
            <Col lg={6} className="d-flex mt-4 justify-content-end">
              <LoadingButton
                variant="primary"
                type="submit"
                disabled={!isValid || uploadMutation.isLoading}
                isLoading={uploadMutation.isLoading}
              >
                Save
              </LoadingButton>
            </Col>
          </Row>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default UploadActualYtd;
