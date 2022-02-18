import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import Loader from 'components/ui/Table/Loader';
import { useFetchBudgetPlanDetail } from 'modules/budgetPlan/hook';
import { deleteBudgetPlanItemGroups } from 'modules/budgetPlanItemGroup/api';
import { BudgetPlanItemGroup } from 'modules/budgetPlanItemGroup/entities';
import {
  useDeleteBudgetPlanItemGroups,
  useFetchBudgetPlanItemGroups,
} from 'modules/budgetPlanItemGroup/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Column, SortingRule } from 'react-table';
import { getAllIds } from 'utils/helpers';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Budget Plan',
    link: '/budget-plans',
  },
  {
    label: 'Detail',
    active: true,
  },
];

const columns: Column<BudgetPlanItemGroup>[] = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Budget Code',
    accessor: 'budgetCode',
  },
  {
    Header: 'Units',
    accessor: 'item',
  },
  {
    Header: 'Currency',
    accessor: 'currency',
  },
  {
    Header: 'Total USD',
    accessor: 'totalAmountUsd',
  },
  {
    Header: 'Total IDR',
    accessor: 'totalAmount',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
  },
];

const DetailBudgetPlan: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const router = useRouter();
  const id = router.query.id as string;

  const dataHook = useFetchBudgetPlanDetail(id);
  const dataHookBudgetPlanItemGroup = useFetchBudgetPlanItemGroups(params);
  const mutationBudgetPlanItemGroup = useDeleteBudgetPlanItemGroups();

  const handleDeleteMultipleBudgetPlanItemsGroups = () => {
    const ids = getAllIds(
      selectedRow,
      dataHookBudgetPlanItemGroup.data
    ) as string[];
    if (ids?.length > 0) {
      deleteBudgetPlanItemGroups(ids);
    }
  };

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={() => router.replace('/budget-plans')}
      title="Detail Budget Plan"
    >
      <Panel>
        {dataHook.isLoading && <Loader size="sm" />}

        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">District</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.districtCode}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Divisi</h4>
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
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Tahun</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.periodYear}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Semester</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.periodType}
            </h3>
          </Col>
        </Row>

        <br />

        <Row>
          <Col lg={12}>
            <Link href={`/budget-plans/${id}/edit`} passHref>
              <Button variant="primary" className="float-right">
                Edit
              </Button>
            </Link>
          </Col>
        </Row>
      </Panel>

      <Panel>
        <Row>
          <Col lg={12} className="d-md-flex mt-40 mb-32 align-items-center">
            <h3 className="mb-3 mb-md-0 text__blue">Budget Plan Item Groups</h3>
            <div className="ml-auto d-flex flex-column flex-md-row">
              <Link href={`/budget-plans/${id}/create-items`} passHref>
                <Button className="mb-1">+ Add Item</Button>
              </Link>
            </div>
          </Col>

          {dataHookBudgetPlanItemGroup.data && (
            <DataTable
              columns={columns}
              data={dataHookBudgetPlanItemGroup.data}
              actions={
                <>
                  <LoadingButton
                    variant="red"
                    size="sm"
                    className="mr-2"
                    disabled={mutationBudgetPlanItemGroup.isLoading}
                    onClick={handleDeleteMultipleBudgetPlanItemsGroups}
                    isLoading={mutationBudgetPlanItemGroup.isLoading}
                  >
                    Delete
                  </LoadingButton>
                </>
              }
              isLoading={dataHook.isFetching}
              selectedSort={selectedSort}
              selectedRows={selectedRow}
              hiddenColumns={['id']}
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

export default DetailBudgetPlan;
