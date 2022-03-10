import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { Currency, currencyOptions } from 'constants/currency';
import { CatalogForm } from 'modules/catalog/entities';
import { useCatalogHelpers } from 'modules/catalog/helpers';
import { useFetchCatalogDetail, useUpdateCatalog } from 'modules/catalog/hook';
import { useAssetGroupOptions } from 'modules/custom/useAssetGroupOptions';
import { useCurrencyRate } from 'modules/custom/useCurrencyRate';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { formatMoney, setValidationError } from 'utils/helpers';
import * as yup from 'yup';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Catalog',
    link: '/master-capex/catalogs',
  },
  {
    label: 'Edit',
    active: true,
  },
];

const schema = yup.object().shape({
  assetGroupId: yup.string().required(`Asset Group can't be empty`),
  detail: yup.string().required(`Detail can't be empty`),
  primaryCurrency: yup.mixed().required(),
  // TODO: price masih hardcode, belum menyesuaikan primaryCurrency
  priceInIdr: yup.string().required(`Price (IDR) can't be empty`),
  priceInUsd: yup.string().required(`Price (USD) can't be empty`),
});

const EditCatalog: NextPage = () => {
  const [assetGroupOptions] = useAssetGroupOptions();
  const { currencyRate } = useCurrencyRate();

  const router = useRouter();
  const id = router.query.id as string;

  const {
    handleSubmit,
    control,
    setError,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CatalogForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const watchForm = watch();

  const { data: dataHook } = useFetchCatalogDetail(id);

  useEffect(() => {
    reset({
      assetGroupId: dataHook?.assetGroup.id,
      detail: dataHook?.detail,
      primaryCurrency: dataHook?.primaryCurrency,
      priceInIdr: dataHook?.priceInIdr,
      priceInUsd: dataHook?.priceInUsd,
    });
  }, [dataHook, reset]);

  const { mutationUpdateCatalog, handleUpdateUnbudget } = useCatalogHelpers();
  const mutation = useUpdateCatalog();
  const handleSubmitForm = (data: CatalogForm) => {
    handleUpdateUnbudget(id, data)
      .then(() => router.push(`/master-capex/catalogs`))
      .catch((error) => setValidationError(error, setError));
  };

  useEffect(() => {
    if (watchForm.primaryCurrency === Currency.Idr) {
      setValue(
        'priceInUsd',
        +(watchForm.priceInIdr / currencyRate).toLocaleString('en-En', {
          maximumFractionDigits: 2,
        })
      );
    } else if (watchForm.primaryCurrency === Currency.Usd) {
      setValue('priceInIdr', watchForm.priceInUsd * currencyRate);
    }
  }, [
    currencyRate,
    setValue,
    watchForm.priceInIdr,
    watchForm.priceInUsd,
    watchForm.primaryCurrency,
  ]);

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Edit Catalog"
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Asset Group</FormLabel>
                <SingleSelect
                  defaultValue=""
                  name="assetGroupId"
                  control={control}
                  placeholder="Select Asset Group"
                  options={assetGroupOptions}
                  error={errors.assetGroupId?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Detail</FormLabel>
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
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Primary Currency</FormLabel>
                <SingleSelect
                  name="primaryCurrency"
                  control={control}
                  defaultValue=""
                  options={currencyOptions}
                  placeholder="Primary Currency"
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Currency Rate</FormLabel>
                <FormControl
                  type="text"
                  value={formatMoney(currencyRate, Currency.Idr)}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormLabel className="required">Price (IDR)</FormLabel>
              <Input
                name="priceInIdr"
                control={control}
                defaultValue=""
                type="number"
                placeholder="Price (IDR)"
                error={errors.priceInIdr?.message}
                disabled={watchForm.primaryCurrency === Currency.Usd}
              />
            </Col>
            <Col lg={6}>
              <FormLabel className="required">Price (USD)</FormLabel>
              <Input
                name="priceInUsd"
                control={control}
                defaultValue=""
                type="number"
                placeholder="Price (USD)"
                error={errors.priceInUsd?.message}
                disabled={watchForm.primaryCurrency === Currency.Idr}
              />
            </Col>
          </Row>
          <Col lg={12} className="d-flex pr-sm-0 mt-4 justify-content-end">
            <LoadingButton
              variant="primary"
              type="submit"
              disabled={mutationUpdateCatalog.isLoading}
              isLoading={mutationUpdateCatalog.isLoading}
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
