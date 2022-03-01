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
import { BudgetPeriodForm } from 'modules/budgetPeriod/entities';
import {
  useFetchBudgetPeriodDetail,
  useUpdateBudgetPeriod,
} from 'modules/budgetPeriod/hook';
import { useDistrictOptions } from 'modules/custom/useDistrictOptions';
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
    label: 'Config Budget Periods',
    link: '/budget-periods',
  },
  {
    label: 'Edit',
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

const EditBudgetPeriod: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: dataHook } = useFetchBudgetPeriodDetail(id);
  const [districtOptions] = useDistrictOptions();

  const mutation = useUpdateBudgetPeriod();

  const {
    handleSubmit,
    control,
    setError,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<BudgetPeriodForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = (data: BudgetPeriodForm) => {
    mutation.mutate(
      { idBudgetPeriod: id, data },
      {
        onSuccess: () => {
          router.push('/budget-periods');
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
  };

  useEffect(() => {
    reset({
      districtCode: dataHook?.districtCode,
      type: dataHook?.type,
      year: dataHook?.year,
      openDate: dataHook?.openDate,
      closeDate: dataHook?.closeDate,
      status: dataHook?.status,
      position: dataHook?.position,
    });
  }, [dataHook, reset]);

  const openDateVal = watch('openDate');

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Edit Config Budget Period"
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
              Update
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default EditBudgetPeriod;
