import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { CatalogForm } from 'modules/catalog/entities';
import { useCreateCatalog } from 'modules/catalog/hook';
import { useAssetGroupOtions } from 'modules/custom/useAssetGroupOptions';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { setValidationError, showErrorMessage } from 'utils/helpers';
import * as yup from 'yup';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Catalog',
    link: '/catalog',
  },
  {
    label: 'Create',
    active: true,
  },
];

const schema = yup.object().shape({
  assetGroupId: yup.mixed().required(),
  detail: yup.mixed().required(),
  primaryCurrency: yup.mixed().required(),
  // TODO: price masih hardcode, belum menyesuaikan primaryCurrency
  priceInIdr: yup.mixed().required(),
  priceInUsd: yup.mixed().required(),
});

const CreateCatalog: NextPage = () => {
  const [assetGroupOtions] = useAssetGroupOtions();

  const router = useRouter();
  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<CatalogForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    delayError: 500,
  });

  const mutation = useCreateCatalog();

  const handleSubmitForm = (data: CatalogForm) => {
    mutation.mutate(data, {
      onSuccess: () => {
        router.push(`/catalog`);
        console.log('created', data);
        toast('Data Created!');
      },
      onError: (error) => {
        console.log('Failed to create data', error);
        setValidationError(error, setError);
        toast(error.message, { autoClose: false });
        showErrorMessage(error);
      },
    });
  };

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={() => router.replace(`/catalog`)}
      title="Create Catalog"
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Asset Group</FormLabel>
                <SingleSelect
                  name="assetGroupId"
                  control={control}
                  placeholder="Select Asset Group"
                  options={assetGroupOtions}
                  error={errors.assetGroupId?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Detail</FormLabel>
                <Input
                  name="detail"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Detail"
                  error={errors.detail?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Primary Currency</FormLabel>
                <SingleSelect
                  name="primaryCurrency"
                  control={control}
                  defaultValue="IDR"
                  options={[
                    { label: 'IDR', value: 'IDR' },
                    { label: 'USD', value: 'USD' },
                  ]}
                  placeholder="PrimaruCurrency"
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Currency Rate</FormLabel>
                {/* <Input
                  name=""
                  control={control}
                  // TODO: get from API
                  defaultValue="14000"
                  type="text"
                  disabled
                /> */}
                <h3 className="profile-detail__info--subtitle">14000</h3>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormLabel>Price (IDR)</FormLabel>
              <Input
                name="priceInIdr"
                control={control}
                defaultValue=""
                type="number"
                placeholder="Price (IDR)"
                error={errors.priceInIdr?.message}
              />
            </Col>
            <Col lg={6}>
              <FormLabel>Price (USD)</FormLabel>
              <Input
                name="priceInUsd"
                control={control}
                defaultValue=""
                type="number"
                placeholder="Price (USD)"
                error={errors.priceInUsd?.message}
              />
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

export default CreateCatalog;
