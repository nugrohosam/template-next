import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import Loader from 'components/ui/Table/Loader';
import AuditTimeline from 'components/ui/Timeline/AuditTimeline';
import { useAttachmentHelpers } from 'modules/attachment/helpers';
import { ResourceType } from 'modules/audit/parent/entities';
import { useFetchAudits } from 'modules/audit/parent/hook';
import {
  useFetchBudgetPlanDetail,
  useFetchCurrentBudgetPlan,
} from 'modules/budgetPlan/hook';
import { getValueItemByMonth } from 'modules/budgetPlanItem/helpers';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { UnbudgetItem } from 'modules/unbudget/entities';
import {
  useFetchUnbudgetDetail,
  useFetchUnbudgetItems,
} from 'modules/unbudget/hook';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Unbudgets',
    link: `/unbudgets`,
  },
  {
    label: 'Detail',
    active: true,
  },
];

const UnbudgetDetails: NextPage = () => {
  const router = useRouter();
  const unbudgetId = router.query.id as string;
  const [profile] = useDecodeToken();

  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHookUnbudgetDetail = useFetchUnbudgetDetail(unbudgetId);
  const dataHookUnbudgetItems = useFetchUnbudgetItems(unbudgetId, params);
  const auditHook = useFetchAudits({
    resourceId: unbudgetId,
    resourceType: ResourceType.Unbudget,
    orderBy: 'asc',
    order: 'created_at',
    pageNumber: 1,
    pageSize: 10,
  });
  const dataHookBudgetPlanDetail = useFetchBudgetPlanDetail(
    dataHookUnbudgetDetail.data?.idCapexBudgetPlan as string
  );
  const { handleDownloadAttachment } = useAttachmentHelpers();

  const columns: Column<UnbudgetItem>[] = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Catalog', accessor: 'catalog' },
    { Header: 'Items', accessor: 'items' },
    { Header: 'Budget Code', accessor: 'budgetCode', minWidth: 300 },
    {
      Header: 'Detail',
      accessor: 'detail',
      minWidth: 300,
      Cell: ({ row }: CellProps<UnbudgetItem>) =>
        row.values.catalog?.detail || '-',
    },
    {
      Header: 'Asset Group',
      accessor: 'assetGroup',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 200 }}>
          {row.values.catalog?.assetGroup?.assetGroup || '-'}
        </div>
      ),
    },
    { Header: 'Currency', accessor: 'currency', minWidth: 150 },
    {
      Header: 'Price/Unit',
      accessor: 'pricePerUnit',
      Cell: ({ row }: CellProps<UnbudgetItem>) =>
        row.values.pricePerUnit.toLocaleString('id-Id'),
    },
    {
      Header: 'Total USD',
      accessor: 'totalAmountUsd',
      Cell: ({ row }: CellProps<UnbudgetItem>) =>
        row.values.totalAmountUsd.toLocaleString('en-EN'),
    },
    {
      Header: 'Total IDR',
      accessor: 'totalAmount',
      Cell: ({ row }: CellProps<UnbudgetItem>) =>
        row.values.totalAmount.toLocaleString('id-Id'),
    },
    {
      Header: 'Jan',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            1,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Feb',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            2,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Mar',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            3,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Apr',
      minWidth: 100,
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            4,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Mei',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            5,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Jun',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            6,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Jul',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            7,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Aug',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            8,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Sep',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            9,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Oct',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            10,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Nov',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            11,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
    {
      Header: 'Dec',
      Cell: ({ row }: CellProps<UnbudgetItem>) => (
        <div style={{ minWidth: 100 }}>
          {getValueItemByMonth(
            row.values.items,
            12,
            !row.values.catalog,
            row.values.currency
          )}
        </div>
      ),
    },
  ];

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Detail Unbudget"
    >
      <Panel>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">District</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanDetail.data?.districtCode || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Divisi</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanDetail?.data?.divisionCode || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Departemen</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanDetail?.data?.departmentCode || '-'}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Year</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanDetail?.data?.periodYear || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Period</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanDetail?.data?.periodType || '-'}
            </h3>
          </Col>
        </Row>
      </Panel>

      <br />

      <Panel>
        {dataHookUnbudgetDetail.isLoading && <Loader size="sm" />}

        <Row>
          <Col lg={12}>
            <h4 className="profile-detail__info--title mb-1">Budget Code</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookUnbudgetDetail?.data?.budgetCode || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Currency</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookUnbudgetDetail?.data?.currency || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Status</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookUnbudgetDetail?.data?.status || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Total USD</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookUnbudgetDetail?.data?.totalAmountUsd?.toLocaleString(
                'en-En'
              ) || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Total IDR</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookUnbudgetDetail?.data?.totalAmount?.toLocaleString(
                'id-Id'
              ) || '-'}
            </h3>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Latar Belakang Kebutuhan Capex
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookUnbudgetDetail?.data?.unbudgetBackground || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Dampak Jika Tidak Realisasi
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookUnbudgetDetail?.data?.unbudgetImpactIfNotRealized || '-'}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Unbudget Attachment
            </h4>
            <h3 className="profile-detail__info--subtitle">
              <Button
                variant="link"
                className="p-0"
                size="sm"
                onClick={() =>
                  handleDownloadAttachment({
                    fileName: dataHookUnbudgetDetail?.data
                      ?.unbudgetAttachment as string,
                    module: 'unbudget',
                  })
                }
              >
                <p className="mb-0">
                  {dataHookUnbudgetDetail?.data?.unbudgetAttachment}
                </p>
              </Button>
            </h3>
          </Col>
        </Row>

        <br />

        <Row>
          <Col lg={12}>
            <Link href={`/unbudgets/${unbudgetId}/edit`} passHref>
              <Button variant="primary" className="float-right">
                Edit
              </Button>
            </Link>
          </Col>
        </Row>
      </Panel>

      {auditHook.data?.items && auditHook.data?.items.length > 0 && (
        <>
          <br />
          <AuditTimeline audit={auditHook.data} />
        </>
      )}

      <br />

      <Panel>
        <Row>
          {dataHookUnbudgetItems.data && (
            <DataTable
              columns={columns}
              data={dataHookUnbudgetItems.data}
              isLoading={dataHookUnbudgetItems.isFetching}
              selectedSort={selectedSort}
              hiddenColumns={['id', 'catalog', 'items']}
              paginateParams={params}
              onSelectedSortChanged={(sort) => {
                setSelectedSort(sort);
                setSortingRules(sort);
              }}
              onSearch={(keyword) => setSearch(keyword)}
              onPageSizeChanged={(pageSize) => setPageSize(pageSize)}
              onChangePage={(page) => setPageNumber(page)}
            ></DataTable>
          )}
        </Row>
      </Panel>
    </DetailLayout>
  );
};

export default UnbudgetDetails;
