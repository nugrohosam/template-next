import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { currency, currencyOptions } from 'constants/currency';
import { CatalogForm } from 'modules/catalog/entities';
import { useFetchCatalogDetail, useUpdateCatalog } from 'modules/catalog/hook';
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

  const { data: dataHook } = useFetchCatalogDetail(id);

  useEffect(() => {
    reset({
      assetGroupId: dataHook?.assetGroup.id,
      detail: dataHook?.detail,
      primaryCurrency: dataHook?.primaryCurrency,
      // TODO: price masih hardcode, belum menyesuaikan primaryCurrency
      priceInIdr: dataHook?.priceInIdr,
      priceInUsd: dataHook?.priceInUsd,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataHook, reset]);

  const mutation = useUpdateCatalog();
  const handleSubmitForm = (data: CatalogForm) => {
    mutation.mutate(
      { idCatalog: id, data },
      {
        onSuccess: () => {
          router.push(`/master-capex/catalogs`);
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
  const currencyRate = 14500; // TODO: get from API

  const data = watch();
  const [idrDisabled, setIdrDisabled] = useState(false);
  const [usdDisabled, setUsdDisabled] = useState(true);

  const handleCurrencyChange = (value: string | number | boolean) => {
    if (value == currency.USD) {
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
            <Col lg={6}>
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
                disabled={usdDisabled}
              />
            </Col>
          </Row>
          <Col lg={12} className="d-flex pr-sm-0 mt-4 justify-content-end">
            <LoadingButton
              variant="primary"
              type="submit"
              disabled={mutation.isLoading}
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
