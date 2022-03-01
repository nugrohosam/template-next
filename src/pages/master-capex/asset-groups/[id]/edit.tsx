import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import Panel from 'components/form/Panel';
import { customStyles, SelectOption } from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { PicType } from 'constants/picType';
import { AssetGroupForm, AssetGroupPics } from 'modules/assetGroup/entities';
import {
  useFetchAssetGroupDetail,
  useUpdateAssetGroup,
} from 'modules/assetGroup/hook';
import { useDistrictOptions } from 'modules/custom/useDistrictOptions';
import { fetchNoiDivision } from 'modules/noi/division/api';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
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
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';
import { debounce } from 'ts-debounce';
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
          await fetchNoiDivision({
            district: val.districtCode,
            pageNumber: 1,
            pageSize: 50,
          }).then(
            (resp) =>
              (options =
                resp.items.map((x) => ({
                  value: x.deptNfs,
                  label: x.deptNfs,
                })) || [])
          );
          return {
            districtCode: val.districtCode,
            departementCode: val.departementCode,
            type: val.type,
            isBudgetCodeDefault: val.isBudgetCodeDefault,
            options,
          };
        });
        const result = await Promise.all(map);
        setMyPicsSite(result.filter((x) => x.type === PicType.SITE));
        setMyPicsHo(result.filter((x) => x.type === PicType.HO));
      }
    })();
  }, [dataHookAssetGroupDetail, reset]);

  const mutation = useUpdateAssetGroup();
  const handleSubmitForm = (data: AssetGroupForm) => {
    const dataPics = myPicsSite.concat(myPicsHo);
    mutation.mutate(
      {
        idAssetGroup: id,
        data: {
          ...data,
          pics: dataPics.map((val) => {
            return {
              districtCode: val.districtCode,
              departementCode: val.departementCode,
              type: val.type,
              isBudgetCodeDefault: val.isBudgetCodeDefault,
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

  const [myPicsSite, setMyPicsSite] = useState<MyPics[]>([]);
  const [myPicsHo, setMyPicsHo] = useState<MyPics[]>([]);

  const districtChoosed = async (
    districtCode: string,
    indexTo: number,
    type: PicType.SITE | PicType.HO
  ) => {
    const result = await fetchNoiDivision({
      district: districtCode,
      pageNumber: 1,
      pageSize: 50,
    });
    if (type === PicType.SITE) {
      setMyPicsSite((prev) => {
        return prev.map((val, index) => {
          if (index === indexTo)
            val = {
              districtCode: districtCode,
              departementCode: '',
              type: PicType.SITE,
              isBudgetCodeDefault: false,
              options:
                result?.items.map((x) => ({
                  value: x.deptNfs,
                  label: x.deptNfs,
                })) || [],
            };
          return val;
        });
      });
    } else if (type === PicType.HO) {
      setMyPicsHo((prev) => {
        return prev.map((val, index) => {
          if (index === indexTo)
            val = {
              districtCode: districtCode,
              departementCode: '',
              type: PicType.HO,
              isBudgetCodeDefault: false,
              options:
                result?.items.map((x) => ({
                  value: x.deptNfs,
                  label: x.deptNfs,
                })) || [],
            };
          return val;
        });
      });
    }
  };

  const departementLoadOptions = useMemo(() => {
    return debounce(
      async (
        inputValue: string,
        callback,
        indexTo: number,
        districtCode: string,
        type: PicType.SITE | PicType.HO
      ) => {
        if (!inputValue) {
          return callback([]);
        } else {
          if (type === PicType.SITE) {
            return await fetchNoiDivision({
              district: districtCode,
              search: inputValue,
              pageNumber: 1,
              pageSize: 50,
            }).then((response) => {
              const options = response.items.map((x) => ({
                value: x.deptNfs,
                label: x.deptNfs,
              }));
              setMyPicsSite((prev) => {
                const newPic = [...prev];
                newPic[indexTo].options = options;
                return newPic;
              });

              return callback(options);
            });
          } else if (type === PicType.HO) {
            return await fetchNoiDivision({
              district: districtCode,
              search: inputValue,
              pageNumber: 1,
              pageSize: 50,
            }).then((response) => {
              const options = response.items.map((x) => ({
                value: x.deptNfs,
                label: x.deptNfs,
              }));
              setMyPicsHo((prev) => {
                const newPic = [...prev];
                newPic[indexTo].options = options;
                return newPic;
              });

              return callback(options);
            });
          }
        }
      },
      600
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMyPicsHo, setMyPicsSite]);

  const handleChangeBudgetCode = (
    event: ChangeEvent<HTMLInputElement>,
    indexTo: number,
    type: PicType.SITE | PicType.HO
  ) => {
    const { checked } = event.target;
    if (type === PicType.SITE) {
      setMyPicsSite((prev) => {
        const newPic = [...prev];
        const findCheckedBudgetCode = newPic.find((x) => x.isBudgetCodeDefault);
        if (findCheckedBudgetCode) {
          newPic.forEach((val, index) => {
            if (index !== indexTo) {
              newPic[index].isBudgetCodeDefault = false;
            }
          });
        }
        newPic[indexTo].isBudgetCodeDefault = checked;
        return newPic;
      });
    } else if (type === PicType.HO) {
      setMyPicsHo((prev) => {
        const newPic = [...prev];
        const findCheckedBudgetCode = newPic.find((x) => x.isBudgetCodeDefault);
        if (findCheckedBudgetCode) {
          newPic.forEach((val, index) => {
            if (index !== indexTo) {
              newPic[index].isBudgetCodeDefault = false;
            }
          });
        }
        newPic[indexTo].isBudgetCodeDefault = checked;
        return newPic;
      });
    }
  };

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Edit Asset Group"
    >
      <Panel>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel className="required">Asset Group</FormLabel>
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
                <FormLabel className="required">Asset Group Code</FormLabel>
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
          <Row className="mb-4">
            <Col lg={12}>
              <h4>PIC HO</h4>
            </Col>
            <Col lg={12}>
              <Table className="table-admin table-inherit" responsive>
                <thead>
                  <tr>
                    <th>District *</th>
                    <th>Departement *</th>
                    <th style={{ width: '250px' }}>Default for Budget Code</th>
                    <th style={{ width: '250px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myPicsHo.map((myPic, index) => (
                    <tr key={index}>
                      <td>
                        <Select
                          instanceId="districtCode"
                          placeholder="Choose District"
                          options={districtOptions}
                          value={districtOptions.find(
                            (val) => val.value === myPic.districtCode
                          )}
                          styles={{
                            ...customStyles(),
                            menu: () => ({
                              zIndex: 99,
                            }),
                          }}
                          onChange={(val) =>
                            districtChoosed(
                              val?.value as string,
                              index,
                              PicType.HO
                            )
                          }
                        />
                      </td>
                      <td>
                        <AsyncSelect
                          instanceId="departementCode"
                          placeholder="Choose Departement"
                          isClearable={false}
                          isSearchable
                          cacheOptions
                          defaultOptions={myPic.options}
                          value={myPic.options.find(
                            (val) => val.value === myPic.departementCode
                          )}
                          loadOptions={(inputValue, callback) => {
                            departementLoadOptions(
                              inputValue,
                              callback,
                              index,
                              myPic.districtCode,
                              PicType.HO
                            );
                          }}
                          styles={{
                            ...customStyles(),
                            menu: () => ({
                              zIndex: 99,
                            }),
                          }}
                          onChange={(val) => {
                            setMyPicsHo((prev) => {
                              const newPic = [...prev];
                              newPic[index].departementCode =
                                (val?.value as string) || '';
                              return newPic;
                            });
                          }}
                        />
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`budgetCodeHo-${index}`}
                              checked={myPicsHo[index].isBudgetCodeDefault}
                              onChange={(e) =>
                                handleChangeBudgetCode(e, index, PicType.HO)
                              }
                            />
                            <label className="custom-control-label"></label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="red"
                          size="sm"
                          className="w-100"
                          disabled={myPicsHo.length <= 1}
                          onClick={() =>
                            setMyPicsHo((prev) =>
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
            </Col>

            <Col lg={12}>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() =>
                  setMyPicsHo((prev) => [
                    ...prev,
                    {
                      districtCode: '',
                      departementCode: '',
                      type: PicType.HO,
                      isBudgetCodeDefault: false,
                      options: [],
                    },
                  ])
                }
              >
                Add
              </Button>
            </Col>
          </Row>

          <br />
          <Row className="mb-4">
            <Col lg={12}>
              <h4>PIC SITE</h4>
            </Col>
            <Col lg={12}>
              <Table className="table-admin table-inherit" responsive>
                <thead>
                  <tr>
                    <th>District *</th>
                    <th>Departement *</th>
                    <th style={{ width: '250px' }}>Default for Budget Code</th>
                    <th style={{ width: '250px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myPicsSite.map((myPic, index) => (
                    <tr key={index}>
                      <td>
                        <Select
                          instanceId="districtCode"
                          placeholder="Choose District"
                          options={districtOptions}
                          value={districtOptions.find(
                            (val) => val.value === myPic.districtCode
                          )}
                          styles={{
                            ...customStyles(),
                            menu: () => ({
                              zIndex: 99,
                            }),
                          }}
                          onChange={(val) =>
                            districtChoosed(
                              val?.value as string,
                              index,
                              PicType.SITE
                            )
                          }
                        />
                      </td>
                      <td>
                        <AsyncSelect
                          instanceId="departementCode"
                          placeholder="Choose Departement"
                          isClearable={false}
                          isSearchable
                          cacheOptions
                          defaultOptions={myPic.options}
                          value={myPic.options.find(
                            (val) => val.value === myPic.departementCode
                          )}
                          loadOptions={(inputValue, callback) => {
                            departementLoadOptions(
                              inputValue,
                              callback,
                              index,
                              myPic.districtCode,
                              PicType.SITE
                            );
                          }}
                          styles={{
                            ...customStyles(),
                            menu: () => ({
                              zIndex: 99,
                            }),
                          }}
                          onChange={(val) => {
                            setMyPicsSite((prev) => {
                              const newPic = [...prev];
                              newPic[index].departementCode =
                                (val?.value as string) || '';
                              return newPic;
                            });
                          }}
                        />
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`budgetCodeSite-${index}`}
                              checked={myPicsSite[index].isBudgetCodeDefault}
                              onChange={(e) =>
                                handleChangeBudgetCode(e, index, PicType.SITE)
                              }
                            />
                            <label className="custom-control-label"></label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="red"
                          size="sm"
                          className="w-100"
                          disabled={myPicsSite.length <= 1}
                          onClick={() =>
                            setMyPicsSite((prev) =>
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
            </Col>

            <Col lg={12}>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() =>
                  setMyPicsSite((prev) => [
                    ...prev,
                    {
                      districtCode: '',
                      departementCode: '',
                      type: PicType.SITE,
                      isBudgetCodeDefault: false,
                      options: [],
                    },
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
