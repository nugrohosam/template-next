import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { CatalogForm } from 'modules/catalog/entities';
import { useFetchCatalogDetail, useUpdateCatalog } from 'modules/catalog/hook';
import { useAssetGroupOtions } from 'modules/custom/useAssetGroupOptions';
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
    label: 'Catalog',
    link: '/catalog',
  },
  {
    label: 'Edit',
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

const EditCatalog: NextPage = () => {
  const [assetGroupOtions] = useAssetGroupOtions();

  const router = useRouter();
  const id = router.query.id as string;

  const {
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors, isValid },
  } = useForm<CatalogForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    delayError: 500,
  });

  const dataHook = useFetchCatalogDetail(id);

  useEffect(() => {
    setTimeout(() => {
      setValue('assetGroupId', dataHook?.data?.assetGroup.id as string);
      setValue('primaryCurrency', dataHook?.data?.primaryCurrency as string);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataHook?.data?.primaryCurrency]);

  const mutation = useUpdateCatalog();
  const handleSubmitForm = (data: CatalogForm) => {
    console.log(data);
    mutation.mutate(
      { idCatalog: id, data },
      {
        onSuccess: () => {
          // router.push(`/catalog/${id}/detail`);
          console.log('updated', data);
          toast('Data Updated!');
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

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={() => router.replace(`/catalog`)}
      title="Edit Catalog"
      loading={dataHook.isLoading}
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Asset Group</FormLabel>
                <SingleSelect
                  defaultValue={dataHook.data?.assetGroup.id}
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
                  defaultValue={dataHook?.data?.detail}
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
                  defaultValue={dataHook?.data?.primaryCurrency}
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
                  name="currencyRate"
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
                defaultValue={dataHook?.data?.priceInIdr}
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
                defaultValue={dataHook?.data?.priceInUsd}
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
              Update
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default EditCatalog;
