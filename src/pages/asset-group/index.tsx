import { customStyles } from 'components/form/SingleSelect';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { AssetGroup } from 'modules/assetGroup/entities';
import {
  useDeleteAssetGroups,
  useFetchAssetGroups,
} from 'modules/assetGroup/hook';
import moment from 'moment';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { getAllIds, showErrorMessage } from 'utils/helpers';

const AssetGroups: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchAssetGroups({
    ...params,
  });
  const mutation = useDeleteAssetGroups();

  const deleteAssetGroups = (ids: Array<string>) => {
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

  const handleDeleteMultipleAssetGroup = () => {
    const ids = getAllIds(selectedRow, dataHook.data) as string[];
    if (ids?.length > 0) {
      deleteAssetGroups(ids);
    }
  };

  const columns = useMemo<Column<AssetGroup>[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Asset Group',
        accessor: 'assetGroup',
      },
      {
        Header: 'Asset Group Code',
        accessor: 'assetGroupCode',
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        Cell: ({ cell }: CellProps<AssetGroup>) => {
          return (
            <span>
              {moment(cell.row.values.createdAt).format('YYYY-MM-DD')}
            </span>
          );
        },
      },
      {
        Header: 'Actions',
        Cell: ({ cell }: CellProps<AssetGroup>) => {
          return (
            <div className="d-flex flex-column">
              <Link href={`/asset-group/${cell.row.values.id}/detail`} passHref>
                <Button className="mb-1">Detail</Button>
              </Link>
              <Link href={`/asset-group/${cell.row.values.id}/edit`} passHref>
                <Button className="mb-1">Edit</Button>
              </Link>
              <Button
                variant="red"
                onClick={() => deleteAssetGroups([cell.row.values.id])}
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
      title="Asset Group"
      controls={
        <Link href={`/asset-group/create`} passHref>
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
                  onClick={handleDeleteMultipleAssetGroup}
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

export default AssetGroups;
