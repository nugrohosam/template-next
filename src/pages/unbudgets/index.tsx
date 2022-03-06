import ButtonActions from 'components/ui/Button/ButtonActions';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { Unbudget } from 'modules/unbudget/entities';
import { useUnbudgetHelpers } from 'modules/unbudget/helpers';
import { useFetchUnbudgets } from 'modules/unbudget/hook';
import moment from 'moment';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { Badge, Button, Col } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';
import { getAllIds } from 'utils/helpers';

enum ActionUnbudget {
  Submit = 'SUBMIT',
  Delete = 'DELETE',
}

const UnbudgetList: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHookUnbudgets = useFetchUnbudgets(params);
  const {
    deleteUnbudgetsMutation,
    handleDeleteUnbudgets,
    submitUnbudgetsMutation,
    handleSubmitUnbudgets,
  } = useUnbudgetHelpers();

  const handleActionMultipleUnbudget = async (action: ActionUnbudget) => {
    const ids = getAllIds(selectedRow, dataHookUnbudgets.data);
    if (ids?.length > 0) {
      action === ActionUnbudget.Submit
        ? await handleSubmitUnbudgets(ids)
        : await handleDeleteUnbudgets(ids);
      setSelectedRow({});
      dataHookUnbudgets.refetch();
    }
  };

  const columns: Column<Unbudget>[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Budget Code',
      accessor: 'budgetCode',
      minWidth: 300,
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
      Cell: ({ row }: CellProps<Unbudget>) =>
        row.values.totalAmountUsd?.toLocaleString('en-EN') || '-',
    },
    {
      Header: 'Total IDR',
      accessor: 'totalAmount',
      Cell: ({ row }: CellProps<Unbudget>) =>
        row.values.totalAmount?.toLocaleString('id-Id') || '-',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }: CellProps<Unbudget>) => {
        return (
          <Badge className="badge--status badge--status-blue">
            {row.values.status}
          </Badge>
        );
      },
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      Cell: ({ row }: CellProps<Unbudget>) => {
        return moment(row.values.createdAt).format('YYYY-MM-DD');
      },
    },
    {
      Header: 'Actions',
      Cell: ({ cell }: CellProps<Unbudget>) => {
        return (
          <ButtonActions
            hrefDetail={`/unbudgets/${cell.row.values.id}/detail`}
            hrefEdit={`/unbudgets/${cell.row.values.id}/edit`}
          ></ButtonActions>
        );
      },
    },
  ];

  return (
    <ContentLayout
      title="Unbudgets"
      controls={
        <Link href={`/unbudgets/create`} passHref>
          <Button>+ Create</Button>
        </Link>
      }
    >
      <Col lg={12}>
        {dataHookUnbudgets.data && (
          <DataTable
            columns={columns}
            data={dataHookUnbudgets.data}
            actions={
              <>
                <LoadingButton
                  variant="red"
                  size="sm"
                  className="mr-2"
                  disabled={deleteUnbudgetsMutation.isLoading}
                  onClick={() =>
                    handleActionMultipleUnbudget(ActionUnbudget.Delete)
                  }
                  isLoading={deleteUnbudgetsMutation.isLoading}
                >
                  Delete
                </LoadingButton>
                <LoadingButton
                  size="sm"
                  className="mr-2"
                  disabled={submitUnbudgetsMutation.isLoading}
                  onClick={() =>
                    handleActionMultipleUnbudget(ActionUnbudget.Submit)
                  }
                  isLoading={submitUnbudgetsMutation.isLoading}
                >
                  Submit
                </LoadingButton>
              </>
            }
            isLoading={dataHookUnbudgets.isFetching}
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

export default UnbudgetList;
