import { customStyles } from 'components/form/SingleSelect';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { Catalog } from 'modules/catalog/entities';
import { useDeleteCatalogs, useFetchCatalogs } from 'modules/catalog/hook';
import { useAssetGroupOptions } from 'modules/custom/useAssetGroupOptions';
import { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { getAllIds, showErrorMessage } from 'utils/helpers';

const CatalogsIndex: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);

  const {
    params,
    setPageNumber,
    setPageSize,
    setSearch,
    setSortingRules,
    setFiltersParams,
  } = usePaginateParams();

  const dataHook = useFetchCatalogs(params);
  const [assetGroupOptions] = useAssetGroupOptions();

  const mutation = useDeleteCatalogs();

  const deleteCatalog = (ids: Array<string>) => {
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

  const handleMultipleDeleteCatalogs = () => {
    const ids = getAllIds(selectedRow, dataHook.data) as string[];
    if (confirm('Delete selected data?')) {
      if (ids?.length > 0) {
        deleteCatalog(ids);
      }
    }
  };

  const columns = useMemo<Column<Catalog>[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Detail',
        accessor: 'detail',
      },
      {
        Header: 'Asset Group',
        accessor: 'assetGroup',
        Cell: ({ cell }: CellProps<Catalog>) => {
          return cell.row.values.assetGroup.assetGroup;
        },
      },
      {
        Header: 'Primary Currency',
        accessor: 'primaryCurrency',
        style: {
          maxWidth: '100px',
        },
      },
      {
        Header: 'Price (IDR)',
        accessor: 'priceInIdr',
        Cell: ({ cell }: CellProps<Catalog>) => {
          return cell.row.values.priceInIdr.toLocaleString('id-Id');
        },
      },
      {
        Header: 'Price (USD)',
        accessor: 'priceInUsd',
        Cell: ({ cell }: CellProps<Catalog>) => {
          return cell.row.values.priceInUsd.toLocaleString('en-Us');
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Actions',
        Cell: ({ cell }: CellProps<Catalog>) => {
          return (
            <div className="d-flex flex-column">
              <Link
                href={`/master-capex/catalogs/${cell.row.values.id}/detail`}
                passHref
              >
                <Button className="mb-1">Detail</Button>
              </Link>
              <Link
                href={`/master-capex/catalogs/${cell.row.values.id}/edit`}
                passHref
              >
                <Button className="mb-1">Edit</Button>
              </Link>
              <Button
                variant="red"
                onClick={() =>
                  confirm('Delete data?')
                    ? deleteCatalog([cell.row.values.id])
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ContentLayout
      title="Catalog"
      controls={
        <Link href={`/master-capex/catalogs/create`} passHref>
          <Button>+ Create</Button>
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
            hiddenColumns={['id']}
            paginateParams={params}
            actions={
              <>
                <LoadingButton
                  variant="red"
                  size="sm"
                  className="mr-2"
                  disabled={mutation.isLoading}
                  isLoading={mutation.isLoading}
                  onClick={handleMultipleDeleteCatalogs}
                >
                  Delete
                </LoadingButton>
              </>
            }
            filters={
              <Col lg={12} className="mb-32">
                <div className="setup-detail p-4">
                  <Row>
                    <Col lg={6}>
                      <p className="mb-1">Asset Group</p>
                      <Select
                        placeholder="Select Asset Group"
                        isClearable
                        options={assetGroupOptions}
                        styles={{
                          ...customStyles(),
                          menu: () => ({
                            zIndex: 99,
                          }),
                        }}
                        onChange={(val) =>
                          setFiltersParams(
                            'assetGroupId',
                            (val?.value as string) || ''
                          )
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            }
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

export default CatalogsIndex;
