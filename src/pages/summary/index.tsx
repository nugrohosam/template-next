import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { AssetGroup } from 'modules/assetGroup/entities';
import { useFetchAssetGroups } from 'modules/assetGroup/hook';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';

const SummaryIndex: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchAssetGroups(params);

  const columns: Column<AssetGroup>[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Asset Group',
      accessor: 'assetGroup',
    },
    {
      Header: 'Actions',
      Cell: ({ cell }: CellProps<AssetGroup>) => {
        return (
          <Link href={`/summary/${cell.row.values.id}`} passHref>
            <Button>Summary</Button>
          </Link>
        );
      },
    },
  ];

  return (
    <ContentLayout title="Summary">
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            data={dataHook.data}
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
          />
        )}
      </Col>
    </ContentLayout>
  );
};

export default SummaryIndex;
