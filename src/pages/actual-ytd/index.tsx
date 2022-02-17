import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { ActualYtd } from 'modules/actualTyd/entities';
import { useFetchActualYtd } from 'modules/actualTyd/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Column, SortingRule } from 'react-table';

const ActualYtdIndex: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);

  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchActualYtd(params);

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
