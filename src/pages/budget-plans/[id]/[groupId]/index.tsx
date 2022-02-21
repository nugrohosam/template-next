import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import Loader from 'components/ui/Table/Loader';
import { ItemOfBudgetPlanItem } from 'modules/budgetPlanItem/entities';
import { useDeleteBudgetPlanitems } from 'modules/budgetPlanItem/hook';
import { BudgetPlanItemGroupItem } from 'modules/budgetPlanItemGroup/entities';
import {
  useFetchBudgetPlanItemGroupDetail,
  useFetchBudgetPlanItemGroupItems,
} from 'modules/budgetPlanItemGroup/hook';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { getAllIds, showErrorMessage } from 'utils/helpers';

const BudgetPlanGroupItemList: NextPage = () => {
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

  // handle delete
  const mutationDeleteBudgetPlanItems = useDeleteBudgetPlanitems();
  const deleteBudgetPlan = (ids: string[]) => {
    mutationDeleteBudgetPlanItems.mutate(ids, {
      onSuccess: () => {
        setSelectedRow({});
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
      deleteBudgetPlan(ids);
    }
  };

  const columns: Column<BudgetPlanItemGroupItem>[] = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Catalog', accessor: 'catalog' },
    { Header: 'Items', accessor: 'items' },
    {
      Header: 'Actions',
      Cell: ({ cell }: CellProps<BudgetPlanItemGroupItem>) => {
        return (
          <div className="d-flex flex-column" style={{ minWidth: 100 }}>
            <Button variant="red" onClick={() => {}}>
              Delete
            </Button>
          </div>
        );
      },
    },
    { Header: 'Budget Code', accessor: 'budgetCode', minWidth: 300 },
    { Header: 'Detail', accessor: 'detail', minWidth: 200 },
    {
      Header: 'Asset Group',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) => (
        <div style={{ minWidth: 200 }}>
          {row.values.catalog?.assetGroup?.assetGroup}
        </div>
      ),
    },
    { Header: 'Currency', accessor: 'currency', minWidth: 150 },
    { Header: 'Price/Unit', accessor: 'pricePerUnit', minWidth: 150 },
    { Header: 'Total USD', accessor: 'totalAmountUsd', minWidth: 200 },
    { Header: 'Total IDR', accessor: 'totalAmount', minWidth: 200 },
    {
      Header: 'Jan',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 1)
          ?.quantity || '-',
    },
    {
      Header: 'Feb',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 2)
          ?.quantity || '-',
    },
    {
      Header: 'Mar',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 3)
          ?.quantity || '-',
    },
    {
      Header: 'Apr',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 4)
          ?.quantity || '-',
    },
    {
      Header: 'Mei',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 5)
          ?.quantity || '-',
    },
    {
      Header: 'Jun',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 6)
          ?.quantity || '-',
    },
    {
      Header: 'Jul',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 7)
          ?.quantity || '-',
    },
    {
      Header: 'Aug',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 8)
          ?.quantity || '-',
    },
    {
      Header: 'Sep',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 9)
          ?.quantity || '-',
    },
    {
      Header: 'Oct',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 10)
          ?.quantity || '-',
    },
    {
      Header: 'Nov',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 11)
          ?.quantity || '-',
    },
    {
      Header: 'Dec',
      Cell: ({ row }: CellProps<BudgetPlanItemGroupItem>) =>
        row.values.items.find((item: ItemOfBudgetPlanItem) => item.month === 12)
          ?.quantity || '-',
    },
  ];

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={() =>
        router.replace(`/budget-plans/${budgetPlanId}/detail`)
      }
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
              {dataHookBudgetPlanItemGroup?.data?.totalAmountUsd}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Total IDR</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHookBudgetPlanItemGroup?.data?.totalAmount}
            </h3>
          </Col>
        </Row>

        <br />

        <Row>
          {dataHookBudgetPlanItemGroupItems.data && (
            <DataTable
              columns={columns}
              data={dataHookBudgetPlanItemGroupItems.data}
              actions={
                <>
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
                </>
              }
              addOns={
                <Link
                  href={`/budget-plans/${budgetPlanId}/${budgetPlanGroupId}/edit`}
                  passHref
                >
                  <Button variant="primary">Edit</Button>
                </Link>
              }
              isLoading={dataHookBudgetPlanItemGroupItems.isFetching}
              selectedSort={selectedSort}
              selectedRows={selectedRow}
              hiddenColumns={['id', 'catalog', 'items']}
              paginateParams={params}
              onSelectedRowsChanged={(rows) => setSelectedRow(rows)}
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

export default BudgetPlanGroupItemList;