import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { periodeTypeOptions, periodeYearOptions } from 'constants/period';
import { BudgetPlanForm } from 'modules/budgetPlan/entities';
import {
  useFetchBudgetPlanDetail,
  useUpdateBudgetPlan,
} from 'modules/budgetPlan/hook';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { setValidationError, showErrorMessage } from 'utils/helpers';
import * as yup from 'yup';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Budget Plan',
    link: '/budget-plans',
  },
  {
    label: 'Edit',
    active: true,
  },
];

const schema = yup.object().shape({
  periodType: yup.mixed().required(),
  periodYear: yup.mixed().required(),
  districtCode: yup.mixed().required(),
  divisionCode: yup.mixed().required(),
  departmentCode: yup.mixed().required(),
});

const CreatePeriodActual: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: dataHookBudgetPlanDetail } = useFetchBudgetPlanDetail(id);

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<BudgetPlanForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    delayError: 500,
  });

  useEffect(() => {
    reset({
      departmentCode: dataHookBudgetPlanDetail?.departmentCode,
      districtCode: dataHookBudgetPlanDetail?.districtCode,
      divisionCode: dataHookBudgetPlanDetail?.divisionCode,
      periodType: dataHookBudgetPlanDetail?.periodType,
      periodYear: dataHookBudgetPlanDetail?.periodYear,
    });
  }, [dataHookBudgetPlanDetail, reset]);

  const mutation = useUpdateBudgetPlan();

  const handleSubmitForm = (data: BudgetPlanForm) => {
    mutation.mutate(
      { idBudgetPlan: id, data },
      {
        onSuccess: () => {
          router.push('/budget-plans');
          toast('Data updated!');
        },
        onError: (error) => {
          console.error('Failed to update data', error);
          setValidationError(error, setError);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Edit Budget Plan"
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Division</FormLabel>
                <Input
                  name="divisionCode"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Division"
                  disabled
                  error={errors.divisionCode?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Departemen</FormLabel>
                <Input
                  name="departmentCode"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Departemen"
                  disabled
                  error={errors.departmentCode?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>District</FormLabel>
                <Input
                  name="districtCode"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="District"
                  disabled
                  error={errors.districtCode?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Periode</FormLabel>
                <SingleSelect
                  name="periodType"
                  control={control}
                  defaultValue=""
                  placeholder="Periode"
                  options={periodeTypeOptions}
                  error={errors.periodType?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Tahun</FormLabel>
                <SingleSelect
                  name="periodYear"
                  control={control}
                  defaultValue=""
                  placeholder="Year"
                  options={periodeYearOptions}
                  error={errors.periodYear?.message}
                />
              </FormGroup>
            </Col>
          </Row>

          <Col lg={12} className="d-flex pr-sm-0 justify-content-end">
            <LoadingButton
              variant="primary"
              type="submit"
              disabled={!isValid || mutation.isLoading}
              isLoading={mutation.isLoading}
            >
              Update
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default CreatePeriodActual;
