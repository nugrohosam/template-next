import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import {
  periodePositionOptions,
  periodeStatusOptions,
  periodeTypeOptions,
  periodeYearOptions,
} from 'constants/period';
import { BudgetPeriod, BudgetPeriodForm } from 'modules/budgetPeriod/entities';
import { useCreateBudgetPeriod } from 'modules/budgetPeriod/hook';
import { useDistrictOptions } from 'modules/custom/useDistrictOptions';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { setValidationError, showErrorMessage } from 'utils/helpers';
import * as yup from 'yup';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Config Budget Periods',
    link: '/master-capex/budget-periods',
  },
  {
    label: 'Create',
    active: true,
  },
];

const schema = yup.object().shape({
  districtCode: yup.string().required(`District can't be empty`),
  type: yup.string().required(`Type can't be empty`),
  year: yup.string().required(`Year can't be empty`),
  openDate: yup.string().required(`Open Date can't be empty`),
  closeDate: yup.string().required(`Close Date can't be empty`),
  status: yup.string().required(`Status can't be empty`),
  position: yup.string().required(`Position can't be empty`),
});

const CreateBudgetPeriod: NextPage = () => {
  const router = useRouter();
  const [districtOptions] = useDistrictOptions();

  const mutation = useCreateBudgetPeriod();

  const {
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<BudgetPeriod>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = (data: BudgetPeriodForm) => {
    mutation.mutate(data, {
      onSuccess: () => {
        router.push('/master-capex/budget-periods');
        toast('Data created!');
      },
      onError: (error) => {
        console.log('Failed to create data', error);
        setValidationError(error, setError);
        toast(error.message, { autoClose: false });
        showErrorMessage(error);
      },
    });
  };

  const openDateVal = watch('openDate');

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Create Config Budget Period"
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">District</FormLabel>
                <SingleSelect
                  name="districtCode"
                  control={control}
                  defaultValue=""
                  placeholder="District"
                  options={districtOptions}
                  error={errors.districtCode?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Type</FormLabel>
                <SingleSelect
                  name="type"
                  control={control}
                  defaultValue=""
                  placeholder="Type"
                  options={periodeTypeOptions}
                  error={errors.type?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Year</FormLabel>
                <SingleSelect
                  name="year"
                  control={control}
                  defaultValue=""
                  placeholder="Year"
                  options={periodeYearOptions}
                  error={errors.year?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Open Date</FormLabel>
                <Input
                  name="openDate"
                  control={control}
                  defaultValue=""
                  type="date"
                  placeholder="Open Date"
                  error={errors.openDate?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Close Date</FormLabel>
                <Input
                  name="closeDate"
                  control={control}
                  defaultValue=""
                  type="date"
                  placeholder="Close Date"
                  error={errors.closeDate?.message}
                  min={openDateVal}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Status</FormLabel>
                <SingleSelect
                  name="status"
                  control={control}
                  defaultValue=""
                  placeholder="Status"
                  options={periodeStatusOptions}
                  error={errors.status?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Position</FormLabel>
                <SingleSelect
                  name="position"
                  control={control}
                  defaultValue=""
                  placeholder="Position"
                  options={periodePositionOptions}
                  error={errors.position?.message}
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
              Create
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default CreateBudgetPeriod;
