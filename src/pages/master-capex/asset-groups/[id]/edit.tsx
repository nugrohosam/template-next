import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import { customStyles, SelectOption } from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { AssetGroupForm, AssetGroupPics } from 'modules/assetGroup/entities';
import {
  useFetchAssetGroupDetail,
  useUpdateAssetGroup,
} from 'modules/assetGroup/hook';
import { useDistrictOptions } from 'modules/custom/useDistrictOptions';
import { fetchNoiDivision } from 'modules/noi/division/api';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormLabel,
  Row,
  Table,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { setValidationError, showErrorMessage } from 'utils/helpers';
import * as yup from 'yup';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Asset Group',
    link: '/master-capex/asset-groups',
  },
  {
    label: 'Edit',
    active: true,
  },
];

const schema = yup.object().shape({
  assetGroup: yup.mixed().required(),
  assetGroupCode: yup.mixed().required(),
});

interface MyPics extends AssetGroupPics {
  options: SelectOption[];
}

const EditPeriodActual: NextPage = () => {
  const [districtOptions] = useDistrictOptions();

  const router = useRouter();
  const id = router.query.id as string;

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<AssetGroupForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    delayError: 500,
  });

  const { data: dataHookAssetGroupDetail } = useFetchAssetGroupDetail(id);
  useEffect(() => {
    (async () => {
      if (dataHookAssetGroupDetail) {
        reset({
          assetGroup: dataHookAssetGroupDetail.assetGroup,
          assetGroupCode: dataHookAssetGroupDetail.assetGroupCode,
        });

        const map = dataHookAssetGroupDetail.pics.map(async (val) => {
          let options: SelectOption[] = [];
          await fetchNoiDivision({ search: val.districtCode }).then(
            (resp) =>
              (options =
                resp.items.map((x) => ({
                  value: x.deptCode,
                  label: x.district,
                })) || [])
          );
          return {
            districtCode: val.districtCode,
            departementCode: val.departementCode,
            options,
          };
        });
        const result = await Promise.all(map);
        setMyPics(result);
      }
    })();
  }, [dataHookAssetGroupDetail, reset]);

  const mutation = useUpdateAssetGroup();
  const handleSubmitForm = (data: AssetGroupForm) => {
    mutation.mutate(
      {
        idAssetGroup: id,
        data: {
          ...data,
          pics: myPics.map((val) => {
            return {
              districtCode: val.districtCode,
              departementCode: val.departementCode,
            };
          }),
        },
      },
      {
        onSuccess: () => {
          router.push('/master-capex/asset-groups');
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

  const [myPics, setMyPics] = useState<MyPics[]>([]);
  const districtChoosed = async (districtCode: string, indexTo: number) => {
    const result = await fetchNoiDivision({ search: districtCode });
    setMyPics((prev) => {
      return prev.map((val, index) => {
        if (index === indexTo)
          val = {
            districtCode: districtCode,
            departementCode: '',
            options:
              result?.items.map((x) => ({
                value: x.deptCode,
                label: x.district,
              })) || [],
          };
        return val;
      });
    });
  };

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Edit Asset Group"
    >
      {JSON.stringify(myPics)}
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Asset Group</FormLabel>
                <Input
                  name="assetGroup"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Asset Group"
                  error={errors.assetGroup?.message}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Asset Group Code</FormLabel>
                <Input
                  name="assetGroupCode"
                  control={control}
                  defaultValue=""
                  type="text"
                  placeholder="Asset Group Code"
                  error={errors.assetGroupCode?.message}
                />
              </FormGroup>
            </Col>
          </Row>

          <br />
          <Row className="mb-3">
            <Col lg={12}>
              <Row>
                <Table className="table-admin table-inherit" responsive>
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>Departement</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myPics.map((myPic, index) => (
                      <tr key={index}>
                        <td>
                          <Select
                            instanceId="districtCode"
                            placeholder="Choose District"
                            options={districtOptions}
                            value={districtOptions?.find(
                              (val) => val.value === myPic.districtCode
                            )}
                            styles={{
                              ...customStyles(),
                              menu: () => ({
                                zIndex: 99,
                              }),
                            }}
                            onChange={(val) =>
                              districtChoosed(val?.value as string, index)
                            }
                          />
                        </td>
                        <td>
                          <Select
                            instanceId="departementCode"
                            placeholder="Choose Departement"
                            options={myPic.options}
                            value={myPic.options?.find(
                              (val) => val.value === myPic.departementCode
                            )}
                            styles={{
                              ...customStyles(),
                              menu: () => ({
                                zIndex: 99,
                              }),
                            }}
                            onChange={(val) => {
                              setMyPics((prev) => {
                                prev[index].departementCode =
                                  (val?.value as string) || '';
                                return prev;
                              });
                            }}
                          />
                        </td>
                        <td>
                          <Button
                            variant="red"
                            size="sm"
                            className="w-100"
                            onClick={() =>
                              setMyPics((prev) =>
                                prev.filter((item, i) => i !== index)
                              )
                            }
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Row>

              <Button
                variant="primary"
                className="mt-4"
                onClick={() =>
                  setMyPics((prev) => [
                    ...prev,
                    { districtCode: '', departementCode: '', options: [] },
                  ])
                }
              >
                Add
              </Button>
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

export default EditPeriodActual;
