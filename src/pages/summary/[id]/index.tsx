import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import InterveneModal from 'components/ui/Modal/InterveneModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import Loader from 'components/ui/Table/Loader';
import { PeriodeType } from 'constants/period';
import { useFetchAssetGroupDetail } from 'modules/assetGroup/hook';
import { AssetGroupSummary, InterveneField } from 'modules/summary/entities';
import {
  useFetchAssetGroupSummary,
  useInterveneSummaryAssetGroup,
} from 'modules/summary/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CellProps, Column } from 'react-table';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

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

const SummaryByAssetGroup: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { params } = usePaginateParams();

  const assetGroupDetailHook = useFetchAssetGroupDetail(id);
  const dataSummaryHook = useFetchAssetGroupSummary(id, params);

  const interveneMutation = useInterveneSummaryAssetGroup();
  const handleIntervene = (data: InterveneField) => {
    interveneMutation.mutate(
      {
        idAssetGroup: id,
        data: {
          ...data,
          assetGroupCode: assetGroupDetailHook.data?.assetGroupCode as string,
          amountLimitation: data.amountLimitation,
          // TODO: year & period get from API
          year: 2022,
          period: PeriodeType.Mb,
        },
      },
      {
        onSuccess: () => {
          dataSummaryHook.refetch();
          toast('Intervene succeeded!');
        },
        onError: (error) => {
          console.log('Failed to intervene', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

  const columns: Column<AssetGroupSummary>[] = [
    {
      Header: 'District',
      id: 'district',
      Cell: ({ row }: CellProps<AssetGroupSummary>) => {
        return row.original.districtCode;
      },
    },
    {
      Header: 'Current Period',
      columns: [
        {
          Header: 'Actual YTD',
          accessor: 'actualYtdCurrentPeriod',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.actualYtdCurrentPeriod?.toLocaleString('id-Id');
          },
          minWidth: 140,
        },
        {
          Header: 'Outstanding PR + PO',
          accessor: 'outstandingPrPo',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.actualYtdCurrentPeriod?.toLocaleString('id-Id');
          },
          minWidth: 240,
        },
        {
          Header: 'Outstanding Budgets',
          accessor: 'outstandingBudgets',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.outstandingBudgets?.toLocaleString('id-Id');
          },
          minWidth: 240,
        },
        {
          Header: 'Total Outstanding',
          accessor: 'totalOutstanding',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.totalOutstanding?.toLocaleString('id-Id');
          },
          minWidth: 240,
        },
        {
          Header: 'Total Estimate Full Year',
          accessor: 'totalEstimateFullYearCurrentPeriod',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.totalEstimateFullYearCurrentPeriod?.toLocaleString(
              'id-Id'
            );
          },
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
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.adjustmentOutstandingPrPo?.toLocaleString(
              'id-Id'
            );
          },
          minWidth: 240,
        },
        {
          Header: 'Outstanding Plan Budgets',
          accessor: 'adjustmentOutstandingBudgets',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.adjustmentOutstandingBudgets?.toLocaleString(
              'id-Id'
            );
          },
          minWidth: 240,
        },
        {
          Header: 'Total',
          accessor: 'totalAdjustmentCurrentPeriod',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.totalAdjustmentCurrentPeriod?.toLocaleString(
              'id-Id'
            );
          },
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
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.outstandingPlanS2CurrentPeriod?.toLocaleString(
              'id-Id'
            );
          },
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
          accessor: 'estimaterOutlookFyCurrentPeriod',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.estimaterOutlookFyCurrentPeriod?.toLocaleString(
              'id-Id'
            );
          },
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
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.approvalCapex?.toLocaleString('id-Id');
          },
          minWidth: 220,
        },
        {
          Header: () => (
            <div>
              Carry Over
              <br /> PR Previous Period
            </div>
          ),
          accessor: 'carryOverPrPreviousePeriod',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.carryOverPrPreviousePeriod?.toLocaleString(
              'id-Id'
            );
          },
          minWidth: 180,
        },
        {
          Header: () => (
            <div>
              Carry Over
              <br /> Plan Previous Period
            </div>
          ),
          accessor: 'carryOverPlanPreviousePeriod',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.carryOverPlanPreviousePeriod?.toLocaleString(
              'id-Id'
            );
          },
          minWidth: 200,
        },
        {
          Header: 'Total',
          accessor: 'totalMb',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.totalMb?.toLocaleString('id-Id');
          },
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
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.mbVsOlFyCurrentPeriod?.toLocaleString('id-Id');
          },
          minWidth: 250,
        },
        {
          id: 'mbVsOlFyCurrentPeriodPercentage',
          accessor: 'mbVsOlFyCurrentPeriodPercentage',
          Cell: ({ row }: CellProps<AssetGroupSummary>) => {
            return row.values.mbVsOlFyCurrentPeriodPercentage?.toLocaleString(
              'id-Id'
            );
          },
          minWidth: 250,
        },
      ],
    },
    {
      Header: 'Action',
      accessor: 'districtCode',
      Cell: ({ cell }: CellProps<AssetGroupSummary>) => {
        return (
          <InterveneModal
            onSend={(data) => handleIntervene(data)}
            interveneData={{
              districtCode: cell.row.values.districtCode,
              totalAmount: cell.row.values.totalMb,
            }}
          />
        );
      },
      minWidth: 140,
    },
  ];

  const totalAmountAllDistrict = dataSummaryHook?.data?.items
    .filter((item) => item.totalMb)
    .map((item) => item.totalMb)
    .reduce((prevValue, currentValue) => prevValue + currentValue, 0) as number;

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
                classTable="table-admin striped-sticky"
                addOns={
                  <InterveneModal
                    onSend={(data) => handleIntervene(data)}
                    interveneData={{
                      totalAmount: totalAmountAllDistrict,
                    }}
                  />
                }
              />
            )}
          </Row>
        </Panel>
      </DetailLayout>
    </>
  );
};

export default SummaryByAssetGroup;
