import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from 'components/form/FileInput';
import Panel from 'components/form/Panel';
import SingleSelect from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import { useAttachmentHelpers } from 'modules/attachment/helpers';
import { DelegateApprovalForm } from 'modules/budgetPlanItemGroup/entities';
import { useBudgetPlanItemGroupHelpers } from 'modules/budgetPlanItemGroup/helpers';
import { useFetchBudgetPlanItemGroupDetail } from 'modules/budgetPlanItemGroup/hook';
import { useUserOptions } from 'modules/user/helpers';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { setValidationError } from 'utils/helpers';
import * as yup from 'yup';

const schema = yup.object().shape({
  nrp: yup.mixed().required(),
  attachment: yup.mixed().required(),
});

const UploadBudgetPlanItem: NextPage = () => {
  const router = useRouter();
  const idBudgetPlan = router.query.id as string;
  const idBudgetPlanGroup = router.query.groupId as string;

  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Detail',
      link: `/budget-plans/${idBudgetPlan}/${idBudgetPlanGroup}`,
    },
    {
      label: 'Delegate Approval',
      active: true,
    },
  ];

  const { userOptions } = useUserOptions({
    type: 'approval budget plan capex',
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    setError,
    watch,
    clearErrors,
    getValues,
    setValue,
  } = useForm<DelegateApprovalForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { attachmentFile: watchAttachmentFile } = watch();

  const dataHookBudgetPlanItemGroup =
    useFetchBudgetPlanItemGroupDetail(idBudgetPlanGroup);
  useEffect(() => {
    if (dataHookBudgetPlanItemGroup.data) {
      setValue('nrp', dataHookBudgetPlanItemGroup.data.delegateApprovalNrp);
      setValue(
        'attachment',
        dataHookBudgetPlanItemGroup.data.delegateAttachment
      );
    }
  }, [dataHookBudgetPlanItemGroup.data, setValue]);

  const { mutationDelegateApproval, handleDelegateApproval } =
    useBudgetPlanItemGroupHelpers();
  const submitForm = (data: DelegateApprovalForm) => {
    delete data.attachmentFile;
    handleDelegateApproval(idBudgetPlanGroup, data)
      .then((result) =>
        router.push(`/budget-plans/${idBudgetPlan}/${idBudgetPlanGroup}`)
      )
      .catch((error) => setValidationError(error, setError));
  };

  const { handleDownloadAttachment } = useAttachmentHelpers();
  const { handleUploadAttachment } = useAttachmentHelpers();
  const uploadAttachment = (attachment: keyof DelegateApprovalForm) => {
    const file = getValues(`${attachment}File` as keyof DelegateApprovalForm);
    handleUploadAttachment(file as File[], 'budget plan')
      .then((result) => setValue(attachment, result.name))
      .catch((error) => setValidationError(error, setError));
  };

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Delegate Approval"
    >
      <Panel>
        <Form onSubmit={handleSubmit(submitForm)}>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Delegate To</FormLabel>
                <SingleSelect
                  name="nrp"
                  control={control}
                  defaultValue=""
                  placeholder="Delegate To"
                  options={userOptions}
                  error={errors.nrp?.message}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Attachment</FormLabel>
                <FileInput
                  name="attachmentFile"
                  control={control}
                  placeholder="Upload File"
                  error={errors.attachment?.message}
                />
                <Button
                  variant="link"
                  className="mt-2 p-0 font-xs"
                  disabled={!!!watchAttachmentFile}
                  onClick={() => {
                    clearErrors('attachment');
                    uploadAttachment('attachment');
                  }}
                >
                  <p className="mb-0">Upload</p>
                </Button>
                {dataHookBudgetPlanItemGroup.data?.delegateAttachment && (
                  <>
                    <br />
                    <Button
                      variant="link"
                      className="mt-2 p-0 font-xs"
                      onClick={() =>
                        handleDownloadAttachment({
                          fileName: dataHookBudgetPlanItemGroup.data
                            ?.delegateAttachment as string,
                          module: 'budget plan',
                        })
                      }
                    >
                      <p>Download Previous Delegate</p>
                    </Button>
                  </>
                )}
              </FormGroup>
            </Col>
          </Row>

          <br />

          <Col lg={12} className="d-flex pr-sm-0 justify-content-end">
            <LoadingButton
              variant="primary"
              type="submit"
              disabled={mutationDelegateApproval.isLoading}
              isLoading={mutationDelegateApproval.isLoading}
            >
              Upload
            </LoadingButton>
          </Col>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default UploadBudgetPlanItem;
