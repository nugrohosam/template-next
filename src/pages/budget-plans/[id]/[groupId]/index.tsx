import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import ApproveModal from 'components/ui/Modal/ApproveModal';
import RejectModal from 'components/ui/Modal/RejectModal';
import ReviseModal from 'components/ui/Modal/ReviseModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import Loader from 'components/ui/Table/Loader';
import AuditTimeline from 'components/ui/Timeline/AuditTimeline';
import { UserType } from 'constants/user';
import { ApprovalField } from 'modules/approval/entities';
import { ResourceType } from 'modules/audit/parent/entities';
import { useFetchAudits } from 'modules/audit/parent/hook';
import { getValueItemByMonth } from 'modules/budgetPlanItem/helpers';
import { useDeleteBudgetPlanitems } from 'modules/budgetPlanItem/hook';
import {
  BudgetPlanItemGroupItem,
  BudgetPlanItemGroupStatus,
  BuildingAttachment,
  BuildingAttachmentType,
} from 'modules/budgetPlanItemGroup/entities';
import {
  useApprovalBudgetPlanItemGroups,
  useFetchBudgetPlanItemGroupDetail,
  useFetchBudgetPlanItemGroupItems,
  useFetchBuildingAttachments,
} from 'modules/budgetPlanItemGroup/hook';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { getAllIds, showErrorMessage } from 'utils/helpers';

const BudgetPlanGroupItemList: NextPage = () => {
  const [profile] = useDecodeToken();
  const router = useRouter();
  const budgetPlanId = router.query.id as string;
  const budgetPlanGroupId = router.query.groupId as string;

  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Detail Budget Plan',
      link: `/budget-plans/${budgetPlanId}/detail`,
    },
    {
      label: 'Detail',
      active: true,
    },
  ];

  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHookBudgetPlanItemGroup =
    useFetchBudgetPlanItemGroupDetail(budgetPlanGroupId);
  const dataHookBudgetPlanItemGroupItems = useFetchBudgetPlanItemGroupItems(
    budgetPlanGroupId,
    params
  );

  const dataHookOutstandingPlanPayment = useFetchBuildingAttachments(
    budgetPlanGroupId,
    { ...params, type: BuildingAttachmentType.OutstandingPlanPayment },
    dataHookBudgetPlanItemGroup?.data?.isBuilding || false
  );

  const dataHookOutstandingRetention = useFetchBuildingAttachments(
    budgetPlanGroupId,
    { ...params, type: BuildingAttachmentType.OutstandingRetention },
    dataHookBudgetPlanItemGroup?.data?.isBuilding || false
  );

  // handle delete
  const mutationDeleteBudgetPlanItems = useDeleteBudgetPlanitems();
  const deleteBudgetPlan = (ids: string[]) => {
    mutationDeleteBudgetPlanItems.mutate(ids, {
      onSuccess: () => {
        setSelectedRow({});
        dataHookBudgetPlanItemGroup.refetch();
        dataHookBudgetPlanItemGroupItems.refetch();
        toast('Data Deleted!');
      },
      onError: (error) => {
        console.error('Failed to Delete data', error);
        toast(error.message, { autoClose: false });
        showErrorMessage(error);
      },
    });
  };
  const handleDeleteMultipleBudgetPlan = () => {
    const ids = getAllIds(
      selectedRow,
      dataHookBudgetPlanItemGroupItems.data
    ) as string[];
    if (ids?.length > 0) {
      if (confirm('Delete selected data?')) deleteBudgetPlan(ids);
    }
  };

  const auditHook = useFetchAudits({
    resourceId: budgetPlanGroupId,
    resourceType: ResourceType.BudgetPlanItemGroup,
    orderBy: 'asc',
    order: 'created_at',
    pageNumber: 1,
    pageSize: 10,
  });

  // permission
  const isUserApprovalBudgetPlanCapex =
    profile?.type === UserType.ApprovalBudgetPlanCapex;
  const isUserAdminCapex = profile?.type === UserType.AdminCapex;
  const isUserDeptPicAssetHo = profile?.type === UserType.DeptPicAssetHo;
  const canEdit = () => {
    if (!isUserAdminCapex) return false;
    const statusAccess = [
      BudgetPlanItemGroupStatus.Draft,
      BudgetPlanItemGroupStatus.Reject,
      BudgetPlanItemGroupStatus.Revise,
    ];
    return statusAccess.includes(
      dataHookBudgetPlanItemGroup?.data?.status as BudgetPlanItemGroupStatus
    );
  };
  const canDelete = () => {
    if (!isUserAdminCapex) return false;
    const statusAccess = [BudgetPlanItemGroupStatus.Draft];
    return statusAccess.includes(
      dataHookBudgetPlanItemGroup?.data?.status as BudgetPlanItemGroupStatus
    );
  };

  const approvalBudgetPlanItemGroupMutation = useApprovalBudgetPlanItemGroups();
  const handleApprovalBudgetPlanItemGroup = (data: ApprovalField) => {
    approvalBudgetPlanItemGroupMutation.mutate(
      {
        idBudgetPlanItemGroups: [budgetPlanGroupId],
        status: data.status,
        remark: data.notes,
      },
      {
        onSuccess: () => {
          router.push(`/budget-plans/${budgetPlanId}/detail`);
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

  const columns: Column<BudgetPlanItemGroupItem>[] = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Catalog', accessor: 'catalog' },
    { Header: 'Items', accessor: 'items' },
    { Header: 'Budget Code', accessor: 'budgetCode', minWidth: 300 },
    {
      Header: 'Detail',
      accessor: 'detail',
      minWidth: 300,
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.catalog?.detail || '-',
    },
    {
      Header: 'Asset Group',
      accessor: 'assetGroup',
      minWidth: 200,
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
        <div style={{ minWidth: 200 }}>
          {row.values.catalog?.assetGroup?.assetGroup || '-'}
        </div>
      ),
    },
    { Header: 'Currency', accessor: 'currency', minWidth: 150 },
    {
      Header: 'Price/Unit',
      accessor: 'pricePerUnit',
      minWidth: 200,
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.pricePerUnit.toLocaleString('id-Id'),
    },
    {
      Header: 'Total USD',
      accessor: 'totalAmountUsd',
      minWidth: 200,
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.totalAmountUsd.toLocaleString('en-EN'),
    },
    {
      Header: 'Total IDR',
      accessor: 'totalAmount',
      minWidth: 200,
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.totalAmount.toLocaleString('id-Id'),
    },
    {
      Header: 'Jan',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
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

  const columnOutstanding: Column<BuildingAttachment>[] = [
    { Header: 'District', accessor: 'districtCode', minWidth: 150 },
    { Header: 'Detail', accessor: 'detail', minWidth: 300 },
    { Header: 'Currency', accessor: 'currency', minWidth: 150 },
    {
      Header: 'Currency Period (IDR)',
      accessor: 'currentPeriodIdr',
      minWidth: 250,
    },
    {
      Header: 'Currency Period (USD)',
      accessor: 'currentPeriodUsd',
      minWidth: 250,
    },
    { Header: 'MB 2022 (IDR)', accessor: 'mbIdr', minWidth: 200 },
    { Header: 'MB 2022 (USD)', accessor: 'mbUsd', minWidth: 200 },
  ];

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Detail Budget Plan Item Group"
    >
      <Panel>
        {dataHookBudgetPlanItemGroup.isLoading && <Loader size="sm" />}

        <Row>
          <Col lg={12}>
            <h4 className="profile-detail__info--title mb-1">Budget Code</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanItemGroup?.data?.budgetCode}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Currency</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanItemGroup?.data?.currency}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Status</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanItemGroup?.data?.status}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Total USD</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanItemGroup?.data?.totalAmountUsd?.toLocaleString(
                'en-En'
              )}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Total IDR</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanItemGroup?.data?.totalAmount?.toLocaleString(
                'id-Id'
              )}
            </h3>
          </Col>
        </Row>

        <br />

        {auditHook.data?.items && auditHook.data?.items.length > 0 && (
          <AuditTimeline audit={auditHook.data} />
        )}

        <br />

        <Row>
          {dataHookBudgetPlanItemGroupItems.data && (
            <DataTable
              columns={columns}
              data={dataHookBudgetPlanItemGroupItems.data}
              actions={
                canDelete() && (
                  <LoadingButton
                    variant="red"
                    size="sm"
                    className="mr-2"
                    disabled={mutationDeleteBudgetPlanItems.isLoading}
                    onClick={handleDeleteMultipleBudgetPlan}
                    isLoading={mutationDeleteBudgetPlanItems.isLoading}
                  >
                    Delete
                  </LoadingButton>
                )
              }
              addOns={
                canEdit() && (
                  <Link
                    href={`/budget-plans/${budgetPlanId}/${budgetPlanGroupId}/edit`}
                    passHref
                  >
                    <Button variant="primary">Edit</Button>
                  </Link>
                )
              }
              isLoading={dataHookBudgetPlanItemGroupItems.isFetching}
              selectedSort={selectedSort}
              selectedRows={selectedRow}
              hiddenColumns={['id', 'catalog', 'items']}
              paginateParams={params}
              {...(canDelete() && {
                onSelectedRowsChanged: (rows) => setSelectedRow(rows),
              })}
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

      {dataHookBudgetPlanItemGroup.data?.isBuilding && (
        <>
          <div className="mt-3">
            <Panel>
              <Row>
                <Col lg={12} className="d-md-flex mb-32 align-items-center">
                  <h3 className="mb-3 mb-md-0 text__blue">
                    Outstanding Plan Payment
                  </h3>
                </Col>

                {dataHookOutstandingPlanPayment.data && (
                  <DataTable
                    columns={columnOutstanding}
                    data={dataHookOutstandingPlanPayment.data}
                    isLoading={dataHookOutstandingPlanPayment.isFetching}
                    selectedSort={selectedSort}
                    selectedRows={selectedRow}
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
          </div>

          <div className="mt-3">
            <Panel>
              <Row>
                <Col lg={12} className="d-md-flex mb-32 align-items-center">
                  <h3 className="mb-3 mb-md-0 text__blue">
                    Outstanding Retention
                  </h3>
                </Col>

                {dataHookOutstandingRetention.data && (
                  <DataTable
                    columns={columnOutstanding}
                    data={dataHookOutstandingRetention.data}
                    isLoading={dataHookOutstandingRetention.isFetching}
                    selectedSort={selectedSort}
                    selectedRows={selectedRow}
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
          </div>
        </>
      )}

      {isUserDeptPicAssetHo &&
        dataHookBudgetPlanItemGroup?.data?.status ===
          'WAITING APPROVAL PIC ASSET HO' && (
          <Panel>
            <Col lg={12}>
              <ApproveModal
                onSend={(data) => handleApprovalBudgetPlanItemGroup(data)}
                classButton="mr-2"
              />
              <ReviseModal
                onSend={(data) => handleApprovalBudgetPlanItemGroup(data)}
                classButton="mr-2"
              />
              <RejectModal
                onSend={(data) => handleApprovalBudgetPlanItemGroup(data)}
                classButton="mr-2"
              />
            </Col>
          </Panel>
        )}
    </DetailLayout>
  );
};

export default BudgetPlanGroupItemList;
