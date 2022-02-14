import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import Loader from 'components/ui/Table/Loader';
import { useFetchBudgetPlanDetail } from 'modules/budget-plan/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Budget Plan',
    link: '/budget-plan',
  },
  {
    label: 'Detail',
    active: true,
  },
];

const DetailBudgetPlan: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const dataHook = useFetchBudgetPlanDetail(id);

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={() => router.replace('/budget-plan')}
      title="Detail Budget Plan"
    >
      <Panel>
        {dataHook.isLoading && <Loader size="sm" />}

        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Division</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.divisionCode}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Departemen</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.departmentCode}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">District</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.districtCode}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Periode</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.periodType}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Tahun</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.periodYear}
            </h3>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Link href={`/budget-plan/${id}/edit`} passHref>
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

export default DetailBudgetPlan;
