import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { ActualYtd } from 'modules/actualTyd/entities';
import { useDeleteActualYtds, useFetchActualYtd } from 'modules/actualTyd/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { getAllIds, showErrorMessage } from 'utils/helpers';

const ActualYtdIndex: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);

  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchActualYtd(params);

  const mutation = useDeleteActualYtds();

  const deleteActualYtd = (ids: Array<string>) => {
    mutation.mutate(ids, {
      onSuccess: () => {
        setSelectedRow({});
        dataHook.refetch();
        toast('Data Deleted!');
      },
      onError: (error) => {
        console.log('Failed to delete data', error);
        toast(error.message, { autoClose: false });
        showErrorMessage(error);
      },
    });
  };

  const handleMultipleDeleteActualYtds = () => {
    const ids = getAllIds(selectedRow, dataHook.data) as string[];
    if (confirm('Delete selected data?')) {
      if (ids?.length > 0) {
        deleteActualYtd(ids);
      }
    }
  };

  const columns = useMemo<Column<ActualYtd>[]>(
    () => [
      {
        Header: 'Year',
        accessor: 'year',
      },
      {
        Header: 'Period',
        accessor: 'period',
      },
      {
        Header: 'District',
        accessor: 'district',
      },
      {
        Header: 'Asset Group',
        accessor: 'assetGroup',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Action',
        accessor: 'id',
        Cell: ({ cell }: CellProps<ActualYtd>) => {
          return (
            <div className="d-flex flex-column">
              <Button
                variant="red"
                onClick={() =>
                  confirm('Delete data?')
                    ? deleteActualYtd([cell.row.values.id])
                    : ''
                }
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <ContentLayout
      title="Actual YTD"
      controls={
        <Link href={`/actual-ytd/upload`} passHref>
          <Button>Upload</Button>
        </Link>
      }
    >
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            data={dataHook.data}
            isLoading={dataHook.isFetching}
            selectedSort={selectedSort}
            selectedRows={selectedRow}
            paginateParams={params}
            onSelectedRowsChanged={(rows) => setSelectedRow(rows)}
            onSelectedSortChanged={(sort) => {
              setSelectedSort(sort);
              setSortingRules(sort);
            }}
            actions={
              <LoadingButton
                variant="red"
                size="sm"
                disabled={mutation.isLoading}
                isLoading={mutation.isLoading}
                onClick={handleMultipleDeleteActualYtds}
              >
                Delete
              </LoadingButton>
            }
            onSearch={(keyword) => setSearch(keyword)}
            onPageSizeChanged={(pageSize) => setPageSize(pageSize)}
            onChangePage={(page) => setPageNumber(page)}
          />
        )}
      </Col>
    </ContentLayout>
  );
};

export default ActualYtdIndex;
