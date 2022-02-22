import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from 'components/form/FileInput';
import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { UploadCatalogReq } from 'modules/catalog/entities';
import { useUploadCatalog } from 'modules/catalog/hook';
import { useDownloadTemplateExcel } from 'modules/downloadTemplate/hook';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { FieldError, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { setValidationError, showErrorMessage } from 'utils/helpers';
import * as yup from 'yup';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Catalog',
    link: '/master-capex/catalogs',
  },
  {
    label: 'Upload',
    active: true,
  },
];

const schema = yup.object().shape({
  file: yup.mixed().required(`File can't be empty`),
});

const UploadCatalog: NextPage = () => {
  const router = useRouter();
  const downloadTemplateExcelMutation = useDownloadTemplateExcel();
  const uploadMutation = useUploadCatalog();

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid },
  } = useForm<UploadCatalogReq>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleDownloadTemplate = () => {
    downloadTemplateExcelMutation.mutate(
      { feature: 'katalog' },
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

  const handleSubmitForm = (data: UploadCatalogReq) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        router.push('/master-capex/catalogs');
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
      backButtonClick={() => router.replace('/master-capex/catalogs')}
      title="Upload Catalog"
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>File</FormLabel>
                <FileInput
                  name="file"
                  control={control}
                  placeholder="Select File"
                  error={(errors.file as unknown as FieldError)?.message}
                />
              </FormGroup>
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
                Submit
              </LoadingButton>
            </Col>
          </Row>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default UploadCatalog;
