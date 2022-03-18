import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import Loader from 'components/ui/Table/Loader';
import SimpleTable from 'components/ui/Table/SimpleTable';
import { ItemOfPurchaseRequest } from 'modules/purchaseRequest/entities';
import { useFetchPurchaseRequestDetail } from 'modules/purchaseRequest/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Column } from 'react-table';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Purchase Requests',
    link: '/purchase-requests',
  },
  {
    label: 'Detail',
    active: true,
  },
];

const PurchaseRequestDetails: NextPage = () => {
  const router = useRouter();
  const idPurchaseRequest = router.query.id as string;

  const dataHook = useFetchPurchaseRequestDetail(idPurchaseRequest);

  const columns: Column<ItemOfPurchaseRequest>[] = [
    { Header: 'Item', accessor: 'item' },
    { Header: 'Description 1', accessor: 'description1' },
    { Header: 'Description 2', accessor: 'description2' },
    { Header: 'Description 3', accessor: 'description3' },
    { Header: 'Description 4', accessor: 'description4' },
    { Header: 'Part No', accessor: 'partNo' },
    { Header: 'Mnemonic', accessor: 'mnemonic' },
    { Header: 'UOM', accessor: 'uom' },
    { Header: 'Quantity', accessor: 'quantity' },
    { Header: 'Price (USD)', accessor: 'priceUsd' },
  ];

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Purchase Request Details"
    >
      <Panel>
        {dataHook.isLoading && <Loader size="sm" />}

        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">PR Date</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.prDate || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Request By</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.requestedBy || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Date Required</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.dateRequired || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Asset Group</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.assetGroup.assetGroup || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">District</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.districtCode || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Department</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.departmentCode || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Delivery Point</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.deliveryPoint || '-'}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Budget Reference
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.budgetReference.budgetCode || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">COA</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.coa || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Descripton Budget Reff
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.budgetReference.description || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Warehouse</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.requestedBy || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Balance (Qty)</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.budgetQtyBalance || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Currency</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.currency || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Balance (Amount)
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.budgetAmountBalance || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Supplier Recommendation
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.supplierRecommendationName || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Quantity Required
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.quantityRequired || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Estimate Price (USD)
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.estimatedPriceUsd || '-'}
            </h3>
          </Col>
          <Col lg={12}>
            <h4 className="profile-detail__info--title mb-1">Description</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.description || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Purchaser</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.purchaser || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Delivery Instruction
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.deliveryInstruction || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Authorized by</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.authorizedBy || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Material Group</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.materialGroup || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">PIC Asset</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.picAsset || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Warranty Hold Payment
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.warrantyHoldPayment || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">UOM</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.uom || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              District Pembebanan
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.districtCodePembebanan || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Attachment</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.attachment || '-'}
            </h3>
          </Col>
        </Row>

        <br />

        <Row>
          <Col lg={12}>
            <Link
              href={`/purchase-requests/${idPurchaseRequest}/edit`}
              passHref
            >
              <Button variant="primary" className="float-right">
                Edit
              </Button>
            </Link>
          </Col>
        </Row>

        <Row>
          <Col lg={12} className="d-md-flex mt-40 mb-32 align-items-center">
            <h3 className="mb-3 mb-md-0 text__blue">Items</h3>
          </Col>

          <SimpleTable
            classTable="table-admin table-inherit"
            columns={columns}
            items={dataHook.data?.items || []}
          />
        </Row>
      </Panel>
    </DetailLayout>
  );
};

export default PurchaseRequestDetails;
