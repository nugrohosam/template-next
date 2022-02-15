import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { BudgetPlan } from 'modules/budgetPlan/entities';
import {
  useDeleteBudgetPlan,
  useFetchBudgetPlan,
} from 'modules/budgetPlan/hook';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { getAllIds, showErrorMessage } from 'utils/helpers';

const BudgetPlanList: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchBudgetPlan({
    ...params,
  });
  const mutation = useDeleteBudgetPlan();

  const deleteBudgetPlan = (ids: Array<string>) => {
    mutation.mutate(ids, {
      onSuccess: () => {
        setSelectedRow({});
        dataHook.refetch();
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
    const ids = getAllIds(selectedRow, dataHook.data) as string[];
    if (ids?.length > 0) {
      deleteBudgetPlan(ids);
    }
  };

  const columns: Column<BudgetPlan>[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'District',
      accessor: 'districtCode',
    },
    {
      Header: 'Division',
      accessor: 'divisionCode',
    },
    {
      Header: 'Department',
      accessor: 'departmentCode',
    },
    {
      Header: 'Year',
      accessor: 'periodYear',
    },
    {
      Header: 'Period',
      accessor: 'periodType',
    },
    {
      Header: 'Actions',
      Cell: ({ cell }: CellProps<BudgetPlan>) => {
        return (
          <div className="d-flex flex-column">
            <Link href={`/budget-plan/${cell.row.values.id}/detail`} passHref>
              <Button className="mb-1">Detail</Button>
            </Link>
            <Link href={`/budget-plan/${cell.row.values.id}/edit`} passHref>
              <Button className="mb-1">Edit</Button>
            </Link>
            <Button
              variant="red"
              onClick={() => deleteBudgetPlan([cell.row.values.id])}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <ContentLayout
      title="Budget Plan"
      controls={
        <Link href={`/budget-plan/create`} passHref>
          <Button>+ Create</Button>
        </Link>
      }
    >
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            data={dataHook.data}
            actions={
              <>
                <LoadingButton
                  variant="red"
                  size="sm"
                  className="mr-2"
                  disabled={mutation.isLoading}
                  onClick={handleDeleteMultipleBudgetPlan}
                  isLoading={mutation.isLoading}
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
      </Col>
    </ContentLayout>
  );
};

export default BudgetPlanList;
