import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { currency, currencyOptions } from 'constants/currency';
import { CatalogForm } from 'modules/catalog/entities';
import { useCreateCatalog } from 'modules/catalog/hook';
import { useAssetGroupOptions } from 'modules/custom/useAssetGroupOptions';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { setValidationError, showErrorMessage } from 'utils/helpers';
import * as yup from 'yup';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Catalog',
    link: '/master-capex/catalogs',
  },
  {
    label: 'Create',
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

const CreateCatalog: NextPage = () => {
  const [assetGroupOtions] = useAssetGroupOptions();

  const router = useRouter();
  const {
    handleSubmit,
    control,
    setError,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CatalogForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const mutation = useCreateCatalog();

  const handleSubmitForm = (data: CatalogForm) => {
    mutation.mutate(data, {
      onSuccess: () => {
        router.push(`/master-capex/catalogs`);
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

  const currencyRate = 14500; // TODO: get from API

  const data = watch();
  const [idrDisabled, setIdrDisabled] = useState(false);
  const [usdDisabled, setUsdDisabled] = useState(true);

  const handleCurrencyChange = (value: string | number | boolean) => {
    if (value === currency.USD) {
      // TODO: reset value IDR
      setUsdDisabled(false);
      setIdrDisabled(true);
    } else {
      // TODO: reset value USD
      setUsdDisabled(true);
      setIdrDisabled(false);
    }
    return currencyOptions;
  };

  useEffect(() => {
    if (data.primaryCurrency === currency.IDR) {
      setValue('priceInUsd', data.priceInIdr / currencyRate);
    } else if (data.primaryCurrency === currency.USD) {
      setValue('priceInIdr', data.priceInUsd * currencyRate);
    }
  }, [data.primaryCurrency, data.priceInIdr, data.priceInUsd, setValue]);

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Create Catalog"
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Asset Group</FormLabel>
                <SingleSelect
                  name="assetGroupId"
                  defaultValue=""
                  control={control}
                  placeholder="Select Asset Group"
                  options={assetGroupOtions}
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
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Primary Currency</FormLabel>
                <SingleSelect
                  name="primaryCurrency"
                  control={control}
                  defaultValue="IDR"
                  options={currencyOptions}
                  placeholder="Primary Currency"
                  onChange={(e) => handleCurrencyChange(e.value)}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Currency Rate</FormLabel>
                {/* TODO: get from API */}
                <FormControl
                  type="text"
                  value={currencyRate.toLocaleString('id-Id')}
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Price (IDR)</FormLabel>
                <Input
                  name="priceInIdr"
                  control={control}
                  defaultValue=""
                  type="number"
                  placeholder="Price (IDR)"
                  error={errors.priceInIdr?.message}
                  disabled={idrDisabled}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Price (USD)</FormLabel>
                <Input
                  name="priceInUsd"
                  control={control}
                  defaultValue=""
                  type="number"
                  placeholder="Price (USD)"
                  error={errors.priceInUsd?.message}
                  disabled={usdDisabled}
                />
              </FormGroup>
            </Col>
          </Row>

          <Col lg={12} className="d-flex pr-sm-0 mt-4 justify-content-end">
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
