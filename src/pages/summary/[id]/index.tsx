import Panel from 'components/form/Panel';
import { customStyles } from 'components/form/SingleSelect';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import InterveneModal from 'components/ui/Modal/InterveneModal';
import Loader from 'components/ui/Table/Loader';
import SimpleTable from 'components/ui/Table/SimpleTable';
import { PeriodeType } from 'constants/period';
import { UserType } from 'constants/user';
import { useAssetGroupOptions } from 'modules/assetGroup/helpers';
import { useFetchAssetGroupDetail } from 'modules/assetGroup/hook';
import { useFetchBudgetPeriod } from 'modules/budgetPeriod/hook';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import {
  AssetGroupSummary,
  InterveneField,
  Summary,
  TotalSummaryData,
} from 'modules/summary/entities';
import { useGroupedDistrictOptions } from 'modules/summary/helpers';
import {
  useFetchAssetGroupSummary,
  useInterveneSummaryAssetGroup,
} from 'modules/summary/hook';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { CellProps, Column } from 'react-table';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Asset Group Summary',
    link: '/summary',
  },
  {
    label: 'Summary',
    active: true,
  },
];

const SummaryByAssetGroup: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [profile] = useDecodeToken();
  const assetGroupOptions = useAssetGroupOptions();
  const groupedDistrictOptions = useGroupedDistrictOptions();
  const canIntervene = profile?.type === UserType.DeptPicAssetHoCapex;

  const [districts, setDistricts] = useState('');
  const assetGroupDetailHook = useFetchAssetGroupDetail(id);
  const dataPeriodHook = useFetchBudgetPeriod({
    search: canIntervene ? '' : profile?.district_code,
  })?.data?.items[0];
  const dataSummaryHook = useFetchAssetGroupSummary(id, {
    year: dataPeriodHook?.year as number,
    period: dataPeriodHook?.type as PeriodeType,
    districts,
  });

  const style = {
    ...customStyles(),
    menu: () => ({
      zIndex: 99,
    }),
  };

  const parsingDataHook = (data: any) => {
    let summaryArr: any[] = [];
    let totalArr: any[] = [
      {
        name: 'Total Pama Mining',
        isCategory: true,
      },
      {
        name: 'Total Pama Others',
        isCategory: true,
      },
      {
        name: 'Total Pama Parents',
        isCategory: true,
      },
    ];

    if (data.length !== 0) {
      data.forEach((item: AssetGroupSummary, idx: number) => {
        summaryArr.push({
          name: item.districtType === 'Mining' ? 'PAMA MINING' : 'PAMA OTHERS',
          isCategory: true,
        });
        if (item.summaryData.length !== 0) {
          item.summaryData.forEach((summaryItem: Summary) => {
            summaryArr.push({
              ...summaryItem,
              isCategory: false,
            });
            Object.keys(summaryItem).forEach((key) => {
              if (key !== 'districtCode') {
                totalArr[idx][`${key}`] = item.summaryData
                  .map((prop) => prop[key as keyof TotalSummaryData])
                  .reduce(
                    (prevValue, currentValue) => prevValue + currentValue,
                    0
                  );
              }
            });
          });
        }
      });
      summaryArr.push({ isCategory: true });
      Object.keys(totalArr[0]).forEach((key) => {
        if (key !== 'name' && key !== 'isCategory') {
          totalArr[2][`${key}`] = summaryArr
            .filter((item) => !item.isCategory)
            .map((prop) => prop[key as keyof TotalSummaryData])
            .reduce((prevValue, currentValue) => prevValue + currentValue, 0);
        }
      });
    }
    const totalAmountAllDistrict = summaryArr
      .filter((data) => data.totalMb)
      .map((data) => data.totalMb)
      .reduce(
        (prevValue, currentValue) => prevValue + currentValue,
        0
      ) as number;

    summaryArr = summaryArr.concat(totalArr);

    return { summaryArr, totalAmountAllDistrict };
  };

  const parsedDataHook = useMemo<any>(
    () => parsingDataHook(dataSummaryHook.data || []),
    [dataSummaryHook.data]
  );

  const interveneMutation = useInterveneSummaryAssetGroup();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleIntervene = (data: InterveneField) => {
    interveneMutation.mutate(
      {
        idAssetGroup: id,
        data: {
          ...data,
          assetGroupCode: assetGroupDetailHook.data?.assetGroupCode as string,
          amountLimitation: data.amountLimitation,
          year: dataPeriodHook?.year as number,
          period: dataPeriodHook?.type as PeriodeType,
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

  const columns = useMemo<Column<any>[]>(
    () => [
      {
        Header: 'District',
        accessor: 'name',
        Cell: ({ row }: CellProps<any>) => {
          return (
            <div className={row.values.isCategory ? 'font-weight-bold' : ''}>
              {row.values.isCategory
                ? row.values.name
                : row.original.districtCode}
            </div>
          );
        },
        minWidth: 160,
      },
      {
        Header: 'Current Period',
        columns: [
          {
            Header: 'Actual YTD',
            accessor: 'actualYtdCurrentPeriod',
            Cell: ({ row }: CellProps<AssetGroupSummary>) => {
              return (
                row.values.actualYtdCurrentPeriod?.toLocaleString('id-Id') || ''
              );
            },
          },
          {
            Header: 'Outstanding PR + PO',
            accessor: 'outstandingPrPo',
            Cell: ({ row }: CellProps<AssetGroupSummary>) => {
              return (
                row.values.actualYtdCurrentPeriod?.toLocaleString('id-Id') || ''
              );
            },
          },
          {
            Header: 'Outstanding Budgets',
            accessor: 'outstandingBudgets',
            Cell: ({ row }: CellProps<AssetGroupSummary>) => {
              return (
                row.values.outstandingBudgets?.toLocaleString('id-Id') || ''
              );
            },
          },
          {
            Header: 'Total Outstanding',
            accessor: 'totalOutstanding',
            Cell: ({ row }: CellProps<AssetGroupSummary>) => {
              return row.values.totalOutstanding?.toLocaleString('id-Id') || '';
            },
          },
          {
            Header: 'Total Estimate Full Year',
            accessor: 'totalEstimateFullYearCurrentPeriod',
            Cell: ({ row }: CellProps<AssetGroupSummary>) => {
              return (
                row.values.totalEstimateFullYearCurrentPeriod?.toLocaleString(
                  'id-Id'
                ) || ''
              );
            },
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
              return (
                row.values.adjustmentOutstandingPrPo?.toLocaleString('id-Id') ||
                ''
              );
            },
          },
          {
            Header: 'Outstanding Plan Budgets',
            accessor: 'adjustmentOutstandingBudgets',
            Cell: ({ row }: CellProps<AssetGroupSummary>) => {
              return (
                row.values.adjustmentOutstandingBudgets?.toLocaleString(
                  'id-Id'
                ) || ''
              );
            },
          },
          {
            Header: 'Total',
            accessor: 'totalAdjustmentCurrentPeriod',
            Cell: ({ row }: CellProps<AssetGroupSummary>) => {
              return (
                row.values.totalAdjustmentCurrentPeriod?.toLocaleString(
                  'id-Id'
                ) || ''
              );
            },
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
              return (
                row.values.outstandingPlanS2CurrentPeriod?.toLocaleString(
                  'id-Id'
                ) || ''
              );
            },
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
              return (
                row.values.estimaterOutlookFyCurrentPeriod?.toLocaleString(
                  'id-Id'
                ) || ''
              );
            },
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
              return row.values.approvalCapex?.toLocaleString('id-Id') || '';
            },
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
              return (
                row.values.carryOverPrPreviousePeriod?.toLocaleString(
                  'id-Id'
                ) || ''
              );
            },
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
              return (
                row.values.carryOverPlanPreviousePeriod?.toLocaleString(
                  'id-Id'
                ) || ''
              );
            },
          },
          {
            Header: 'Total',
            accessor: 'totalMb',
            Cell: ({ row }: CellProps<AssetGroupSummary>) => {
              return row.values.totalMb?.toLocaleString('id-Id') || '';
            },
          },
          {
            Header: 'Intervene',
            accessor: 'intervene',
            Cell: ({ row }: CellProps<AssetGroupSummary>) => {
              return row.values.intervene?.toLocaleString('id-Id') || '';
            },
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
        accessor: 'mbVsOlFyCurrentPeriod',
        Cell: ({ row }: CellProps<AssetGroupSummary>) => {
          return (
            row.values.mbVsOlFyCurrentPeriod?.toLocaleString('id-Id') || ''
          );
        },
      },
      {
        Header: () => (
          <div>
            MB VS OL FY
            <br /> Current Period (%)
          </div>
        ),
        accessor: 'mbVsOlFyCurrentPeriodPercentage',
        Cell: ({ row }: CellProps<AssetGroupSummary>) => {
          return (
            row.values.mbVsOlFyCurrentPeriodPercentage
              ?.toLocaleString('id-Id')
              .concat('%') || ''
          );
        },
      },
      {
        Header: 'Action',
        accessor: 'isCategory',
        Cell: ({ row }: CellProps<Summary>) => {
          return (
            (!row.values.isCategory && canIntervene && (
              <InterveneModal
                onSend={(data) => handleIntervene(data)}
                interveneData={{
                  districtCode: row.original.districtCode,
                  totalAmount: row.original.totalMb,
                }}
              />
            )) ||
            ''
          );
        },
        minWidth: 140,
      },
    ],
    [canIntervene, handleIntervene]
  );

  return (
    <>
      <DetailLayout
        title="Summary"
        backButtonClick={router.back}
        paths={breadCrumb}
      >
        <Panel>
          {assetGroupDetailHook.isLoading && <Loader size="sm" />}

          <Row>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Year</h4>
              <h3 className="profile-detail__info--subtitle">
                {dataPeriodHook?.year}
              </h3>
            </Col>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Period</h4>
              <h3 className="profile-detail__info--subtitle">
                {dataPeriodHook?.type}
              </h3>
            </Col>
          </Row>

          <br />
          <Row>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">Asset Group</h4>
              <Select
                className="mb-2 mb-lg-0"
                instanceId="assetGroup"
                placeholder="Select Asset Group"
                value={assetGroupOptions.find((item) => item.value === id)}
                options={assetGroupOptions}
                styles={style}
                onChange={(val) => {
                  if (val) {
                    router.push(`/summary/${val.value}`);
                  }
                }}
              />
            </Col>
            <Col lg={6}>
              <h4 className="profile-detail__info--title mb-1">District</h4>
              <Select
                instanceId="districts"
                placeholder="Select District"
                isMulti
                isClearable
                options={groupedDistrictOptions}
                selected={id}
                styles={style}
                onChange={(val) => {
                  setDistricts(val.map((item) => item.value).join());
                }}
              />
            </Col>
          </Row>
        </Panel>
        <Panel>
          <Row>
            <SimpleTable
              columns={columns}
              items={parsedDataHook.summaryArr}
              isLoading={dataSummaryHook.isFetching}
              classTable="table-admin striped--summary summary-sticky"
              classThead="text-nowrap"
              addOns={
                canIntervene && (
                  <InterveneModal
                    onSend={(data) => handleIntervene(data)}
                    interveneData={{
                      totalAmount: parsedDataHook.totalAmountAllDistrict,
                    }}
                  />
                )
              }
            />
          </Row>
        </Panel>
      </DetailLayout>
    </>
  );
};

export default SummaryByAssetGroup;
