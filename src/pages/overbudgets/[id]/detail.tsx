import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import ApproveModal from 'components/ui/Modal/ApproveModal';
import RejectModal from 'components/ui/Modal/RejectModal';
import ReviseModal from 'components/ui/Modal/ReviseModal';
import AuditTimeline from 'components/ui/Timeline/AuditTimeline';
import { ApprovalField } from 'modules/approval/entities';
import { useAttachmentHelpers } from 'modules/attachment/helpers';
import { ResourceType } from 'modules/audit/parent/entities';
import { useFetchAudits } from 'modules/audit/parent/hook';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { OverbudgetStatus } from 'modules/overbudget/constant';
import {
  permissionOverbudgetHelpers,
  useOverbudgetHelpers,
} from 'modules/overbudget/helpers';
import { useFetchOverbudgetDetail } from 'modules/overbudget/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Col, Row } from 'react-bootstrap';
import { formatMoney } from 'utils/helpers';

const DetailOverbudget: NextPage = () => {
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
  const dataHook = useFetchOverbudgetDetail(id);

  const { handleDownloadAttachment } = useAttachmentHelpers();
  const { userCanApproveData, canEdit } = permissionOverbudgetHelpers(
    profile?.type
  );

  const auditHook = useFetchAudits({
    resourceId: id,
    resourceType: ResourceType.Overbudget,
    orderBy: 'asc',
    order: 'created_at',
    pageNumber: 1,
    pageSize: 10,
  });

  const { handleApprovalOverbudgets } = useOverbudgetHelpers();
  const approvalOverbudget = async (data: ApprovalField) => {
    handleApprovalOverbudgets({
      idOverbudgets: [id],
      status: data?.status,
      remark: data?.notes,
    });
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
              {formatMoney(dataHook?.data?.currentBalance, currency)}
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
                currency
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
              {formatMoney(dataHook?.data?.additionalBudgetPerUnit, currency)}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Over Budget</h4>
            <h3 className="profile-detail__info--subtitle">
              {formatMoney(dataHook?.data?.overBudget, currency)}
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
            {canEdit(dataHook?.data?.status) && (
              <>
                <Link href={`/overbudgets/${id}/edit`} passHref>
                  <Button variant="primary" className="float-right">
                    Edit
                  </Button>
                </Link>
              </>
            )}
            {userCanApproveData && (
              <>
                <ApproveModal onSend={approvalOverbudget} classButton="mr-2" />
                <ReviseModal onSend={approvalOverbudget} classButton="mr-2" />
                <RejectModal onSend={approvalOverbudget} classButton="mr-2" />
              </>
            )}
          </Col>
        </Row>
      </Panel>
      {auditHook.data?.items &&
        auditHook.data?.items.length > 0 &&
        dataHook.data?.status !== OverbudgetStatus.Draft && (
          <AuditTimeline audit={auditHook.data} />
        )}
    </DetailLayout>
  );
};

export default DetailOverbudget;
