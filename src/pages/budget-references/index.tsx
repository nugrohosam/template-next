import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { Currency } from 'constants/currency';
import { BudgetReference } from 'modules/budgetReference/entities';
import { useFetchBudgetReferences } from 'modules/budgetReference/hook';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { Col } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';

const columns: Column<BudgetReference>[] = [
  { Header: 'Budget Code', accessor: 'budgetCode', minWidth: 200 },
  { Header: 'District Code', accessor: 'districtCode', minWidth: 200 },
  { Header: 'Division Code', accessor: 'divisionCode', minWidth: 200 },
  { Header: 'Department Code', accessor: 'departmentCode', minWidth: 200 },
  {
    Header: 'Currency',
    accessor: 'currency',
    minWidth: 150,
    Cell: ({ row }: CellProps<BudgetReference>) => row.values.currency || '-',
  },
  {
    Header: 'Balance',
    accessor: 'balance',
    minWidth: 150,
    Cell: ({ row }: CellProps<BudgetReference>) =>
      row.values.balance?.toLocaleString(
        row.values.currency === Currency.USD ? 'en-En' : 'id-Id'
      ) || '-',
  },
  {
    Header: 'Currency Balance',
    accessor: 'currentBalance',
    minWidth: 200,
    Cell: ({ row }: CellProps<BudgetReference>) =>
      row.values.currentBalance?.toLocaleString(
        row.values.currency === Currency.USD ? 'en-En' : 'id-Id'
      ) || '-',
  },
];

const BudgetReferenceList: NextPage = () => {
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchBudgetReferences(params);

  return (
    <ContentLayout title="Budget References">
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            data={dataHook.data}
            isLoading={dataHook.isFetching}
            selectedSort={selectedSort}
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
      </Col>
    </ContentLayout>
  );
};

export default BudgetReferenceList;
