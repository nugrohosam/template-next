import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import { useFetchBudgetPeriodDetail } from 'modules/budgetPeriod/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Col, Row } from 'react-bootstrap';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Config Budget Periods',
    link: '/master-capex/budget-periods',
  },
  {
    label: 'Detail',
    active: true,
  },
];

const BudgetPeriodDetail: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const dataHook = useFetchBudgetPeriodDetail(id);

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Detail Config Budget Period"
    >
      <Panel>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">District</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.districtCode}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Type</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.type}
            </h3>
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Year</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.year}
            </h3>
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Open Date</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.openDate}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Close Date</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.closeDate}
            </h3>
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Status</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.status}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Position</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.position}
            </h3>
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={12}>
            <Link href={`/master-capex/budget-periods/${id}/edit`} passHref>
              <Button variant="primary" className="float-right">
                Edit
              </Button>
            </Link>
          </Col>
        </Row>
      </Panel>
    </DetailLayout>
  );
};

export default BudgetPeriodDetail;
