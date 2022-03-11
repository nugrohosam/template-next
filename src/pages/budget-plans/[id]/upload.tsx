import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from 'components/form/FileInput';
import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { UploadBudgetPlanItemUForm } from 'modules/budgetPlanItem/entities';
import { useBudgetPlanItemHelpers } from 'modules/budgetPlanItem/helpers';
import { useDownloadTemplateHelpers } from 'modules/downloadTemplate/helpers';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { FieldError, useForm } from 'react-hook-form';
import { setValidationError } from 'utils/helpers';
import * as yup from 'yup';

const schema = yup.object().shape({
  file: yup.mixed().required(`File can't be empty`),
});

const UploadBudgetPlanItem: NextPage = () => {
  const router = useRouter();
  const idBudgetPlan = router.query.id as string;

  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Detail',
      link: `/budget-plans/${idBudgetPlan}/detail`,
    },
    {
      label: 'Upload Budget Plan Item',
      active: true,
    },
  ];

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    setError,
  } = useForm<UploadBudgetPlanItemUForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { handleDownloadTemplate } = useDownloadTemplateHelpers();
  const { mutationUploadBudgetPlanItems, handleUploadBudgetPlanItems } =
    useBudgetPlanItemHelpers();
  const submitForm = (data: UploadBudgetPlanItemUForm) => {
    handleUploadBudgetPlanItems({ ...data, idBudgetPlan: idBudgetPlan })
      .then((result) => router.push(`/budget-plans/${idBudgetPlan}`))
      .catch((error) => setValidationError(error, setError));
  };

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Upload Budget Plan Item"
    >
      <Panel>
        <Form onSubmit={handleSubmit(submitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>File</FormLabel>
                <FileInput
                  name="file"
                  control={control}
                  placeholder="Upload Excel File"
                  error={(errors.file as unknown as FieldError)?.message}
                />
                <Button
                  variant="link"
                  className="mt-2 p-0 font-xs"
                  onClick={() => handleDownloadTemplate('budget plan item')}
                >
                  <p>Download Template</p>
                </Button>
              </FormGroup>
            </Col>
          </Row>

          <br />

          <Col lg={12} className="d-flex pr-sm-0 justify-content-end">
            <LoadingButton
              variant="primary"
              type="submit"
              disabled={mutationUploadBudgetPlanItems.isLoading}
              isLoading={mutationUploadBudgetPlanItems.isLoading}
            >
              Upload
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default UploadBudgetPlanItem;
