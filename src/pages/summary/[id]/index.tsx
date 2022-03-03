import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import Loader from 'components/ui/Table/Loader';
import { useFetchAssetGroupDetail } from 'modules/assetGroup/hook';
import { AssetGroupSummary } from 'modules/summary/entities';
import { useFetchAssetGroupSummary } from 'modules/summary/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CellProps, Column } from 'react-table';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Asset Group',
    link: '/master-capex/asset-groups',
  },
  {
    label: 'Summary',
    active: true,
  },
];

const columns: Column<AssetGroupSummary>[] = [
  {
    Header: 'District',
    accessor: 'districtCode',
    minWidth: 110,
  },
  {
    Header: 'Current Period',
    columns: [
      {
        Header: 'Actual YTD',
        accessor: 'actualYtdCurrentPeriod',
        minWidth: 140,
      },
      {
        Header: 'Outstanding PR + PO',
        accessor: 'outstandingPrPo',
        minWidth: 240,
      },
      {
        Header: 'Outstanding Budgets',
        accessor: 'outstandingBudgets',
        minWidth: 240,
      },
      {
        Header: 'Total Outstanding',
        accessor: 'totalOutstanding',
        minWidth: 240,
      },
      {
        Header: 'Total Estimate Full Year',
        accessor: 'totalEstimateFullYearCurrentPeriod',
        minWidth: 260,
      },
    ],
  },
  {
    Header: 'Adjustment Plan Capex Current Period',
    columns: [
      {
        Header: 'Outstanding PR + PO',
        accessor: 'adjustmentOutstandingPrPo',
        minWidth: 240,
      },
      {
        Header: 'Outstanding Plan Budgets',
        accessor: 'adjustmentOutstandingBudgets',
        minWidth: 240,
      },
      {
        Header: 'Total',
        accessor: 'totalAdjustmentCurrentPeriod',
        minWidth: 110,
      },
    ],
  },
  {
    Header: 'Outstanding',
    columns: [
      {
        Header: () => (
          <div>
            Plan S2 Current Period
            <br /> (Incl OS PR-PO + Budgtes)
          </div>
        ),
        accessor: 'outstandingPlanS2CurrentPeriod',
        minWidth: 270,
      },
    ],
  },
  {
    Header: 'Estimate',
    columns: [
      {
        Header: () => (
          <div>
            Outlook
            <br /> FY Current Period
          </div>
        ),
        accessor: 'estimateOutlookFyCurrentPeriod',
        minWidth: 180,
      },
    ],
  },
  {
    Header: 'MB',
    columns: [
      {
        Header: () => (
          <div>
            Approval
            <br /> Capex
          </div>
        ),
        accessor: 'approvalCapex',
        minWidth: 220,
      },
      {
        Header: () => (
          <div>
            Carry Over
            <br /> PR Previous Period
          </div>
        ),
        accessor: 'carryOverPrPreviousPeriod',
        minWidth: 180,
      },
      {
        Header: () => (
          <div>
            Carry Over
            <br /> Plan Previous Period
          </div>
        ),
        accessor: 'carryOverPlanPreviousPeriod',
        minWidth: 200,
      },
      {
        Header: 'Total',
        accessor: 'totalMb',
        minWidth: 150,
      },
    ],
  },
  {
    Header: () => (
      <div>
        MB VS OL FY
        <br /> Current Period
      </div>
    ),
    id: 'mbVsOl',
    columns: [
      {
        id: 'mbVsOlFyCurrentPeriod',
        accessor: 'mbVsOlFyCurrentPeriod',
        minWidth: 250,
      },
      {
        id: 'mbVsOlFyCurrentPeriodPercentage',
        accessor: 'mbVsOlFyCurrentPeriodPercentage',
        minWidth: 250,
      },
    ],
  },
];

const SummaryByAssetGroup: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { params } = usePaginateParams();

  const assetGroupDetailHook = useFetchAssetGroupDetail(id);
  const dataSummaryHook = useFetchAssetGroupSummary(id, params);

  return (
    <>
      <DetailLayout
        title="Summary"
        backButtonClick={router.back}
        paths={breadCrumb}
      >
        <Panel>
          {/* TODO: data di atas tabel summary masih hardcode */}
          {assetGroupDetailHook.isLoading && <Loader size="sm" />}

          <Row>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Year</h4>
              <h3 className="profile-detail__info--subtitle">2022</h3>
            </Col>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Period</h4>
              <h3 className="profile-detail__info--subtitle">MB</h3>
            </Col>
          </Row>

          <br />
          <Row>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">
                Summary Currency
              </h4>
              <h3 className="profile-detail__info--subtitle">USD</h3>
            </Col>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">
                Currency Rate
              </h4>
              <h3 className="profile-detail__info--subtitle">14.500</h3>
            </Col>
          </Row>

          <br />
          <Row>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Asset Group</h4>
              <h3 className="profile-detail__info--subtitle">
                {assetGroupDetailHook?.data?.assetGroup}
              </h3>
            </Col>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">District</h4>
              <h3 className="profile-detail__info--subtitle">District Code</h3>
            </Col>
          </Row>
        </Panel>
        <Panel>
          <Row>
            {dataSummaryHook.data && (
              <DataTable
                columns={columns}
                data={dataSummaryHook.data}
                classThead="text-nowrap"
              />
            )}
          </Row>
        </Panel>
      </DetailLayout>
    </>
  );
};

export default SummaryByAssetGroup;
