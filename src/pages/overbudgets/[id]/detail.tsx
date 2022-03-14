import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import ApproveModal from 'components/ui/Modal/ApproveModal';
import RejectModal from 'components/ui/Modal/RejectModal';
import ReviseModal from 'components/ui/Modal/ReviseModal';
import AuditTimeline from 'components/ui/Timeline/AuditTimeline';
import { Currency } from 'constants/currency';
import { OverBudgetStatus } from 'constants/status';
import { UserType } from 'constants/user';
import { ApprovalField } from 'modules/approval/entities';
import { useAttachmentHelpers } from 'modules/attachment/helpers';
import { ResourceType } from 'modules/audit/parent/entities';
import { useFetchAudits } from 'modules/audit/parent/hook';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import {
  useApprovalOverbudgets,
  useFetchOverBudgetDetail,
} from 'modules/overbudget/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { formatMoney, showErrorMessage } from 'utils/helpers';

const DetailOverBudget: NextPage = () => {
  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Overbudgets',
      link: '/overbudgets',
    },
    {
      label: 'Detail',
      active: true,
    },
  ];

  const router = useRouter();
  const id = router.query.id as string;
  const [profile] = useDecodeToken();
  const dataHook = useFetchOverBudgetDetail(id);
  const { handleDownloadAttachment } = useAttachmentHelpers();
  const dataEditable =
    dataHook?.data?.status === OverBudgetStatus.DRAFT ||
    dataHook?.data?.status === OverBudgetStatus.REVISE;

  const auditHook = useFetchAudits({
    resourceId: id,
    resourceType: ResourceType.Overbudget,
    orderBy: 'asc',
    order: 'created_at',
    pageNumber: 1,
    pageSize: 10,
  });

  const approvalOverbudgetMutation = useApprovalOverbudgets();
  const handleApprovalOverbudgets = (
    data: ApprovalField,
    idOverbudgets: string
  ) => {
    approvalOverbudgetMutation.mutate(
      {
        idOverbudgets: [idOverbudgets],
        status: data.status,
        remark: data.notes,
      },
      {
        onSuccess: () => {
          dataHook.refetch();
          toast('Data approved!');
        },
        onError: (error) => {
          console.log('Failed to approve data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };
  const currency = dataHook?.data?.budgetReference.currency;

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Detail Overbudget"
    >
      <Panel>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Budget Code</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.budgetReference.budgetCode}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Current Balance
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.currentBalance}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Description</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook.data?.budgetReference.description || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Quantity</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.budgetReference.qty}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Currency</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.budgetReference.currency}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Price Per Unit</h4>
            <h3 className="profile-detail__info--subtitle">
              {formatMoney(
                dataHook?.data?.budgetReference.pricePerUnit,
                Currency.Idr
              )}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Additional Budget/Unit
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {formatMoney(
                dataHook?.data?.additionalBudgetPerUnit,
                Currency.Idr
              )}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Over Budget</h4>
            <h3 className="profile-detail__info--subtitle">
              {formatMoney(dataHook?.data?.overBudget, Currency.Idr)}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Latar Belakang Kebutuhan Capex
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.background}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Dampak Jika Tidak Realisasi
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.impactIfNotRealized}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Attachment File
            </h4>
            <Button
              size="sm"
              variant="link"
              className="p-0 font-xs"
              onClick={() =>
                handleDownloadAttachment({
                  fileName: dataHook?.data?.attachment || '',
                  module: 'overbudget',
                })
              }
            >
              <p>{dataHook?.data?.attachment}</p>
            </Button>
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={12}>
            {profile?.type !== UserType.ApprovalBudgetPlanCapex &&
              dataEditable && (
                <>
                  <Link href={`/overbudgets/${id}/edit`} passHref>
                    <Button variant="primary" className="float-right">
                      Edit
                    </Button>
                  </Link>
                </>
              )}
            {profile?.type === UserType.ApprovalBudgetPlanCapex && (
              <>
                <ApproveModal
                  onSend={(data) => handleApprovalOverbudgets(data, id)}
                  classButton="mr-2"
                />
                <ReviseModal
                  onSend={(data) => handleApprovalOverbudgets(data, id)}
                  classButton="mr-2"
                />
                <RejectModal
                  onSend={(data) => handleApprovalOverbudgets(data, id)}
                  classButton="mr-2"
                />
              </>
            )}
          </Col>
        </Row>
      </Panel>
      {auditHook.data?.items &&
        auditHook.data?.items.length > 0 &&
        dataHook.data?.status !== OverBudgetStatus.DRAFT && (
          <AuditTimeline audit={auditHook.data} />
        )}
    </DetailLayout>
  );
};

export default DetailOverBudget;
