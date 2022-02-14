import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import { useFetchCatalogDetail } from 'modules/catalog/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Column } from 'react-table';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Catalog',
    link: '/catalog',
  },
  {
    label: 'Detail',
    active: true,
  },
];

const CatalogDetail: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const dataHook = useFetchCatalogDetail(id);
  const currencyRate =
    (dataHook?.data?.priceInIdr as number) /
    (dataHook?.data?.priceInUsd as number);

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={() => router.replace('/catalog')}
      title="Detail Catalog"
    >
      <Panel>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Asset Group</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.assetGroup.assetGroup}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Detail</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.detail}
            </h3>
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Primary Currency
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.primaryCurrency}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Currency Rate</h4>
            <h3 className="profile-detail__info--subtitle">
              {currencyRate.toLocaleString('id-Id')}
            </h3>
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Price (IDR)</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.priceInIdr.toLocaleString('id-Id')}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Price (USD)</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.priceInUsd.toLocaleString('en-Us')}
            </h3>
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={12}>
            <Link href={`/catalog/${id}/edit`} passHref>
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

export default CatalogDetail;
