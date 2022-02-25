import { customStyles, SelectOption } from 'components/form/SingleSelect';
import ButtonActions from 'components/ui/Button/ButtonActions';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { Catalog } from 'modules/catalog/entities';
import {
  useDeleteCatalogs,
  useDownloadCatalogExcel,
  useFetchCatalogs,
} from 'modules/catalog/hook';
import { ResponseError } from 'modules/common/types';
import { useAssetGroupOptions } from 'modules/custom/useAssetGroupOptions';
import { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Select, { OptionsType } from 'react-select';
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
  const downloadCatalogMutation = useDownloadCatalogExcel();

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

  const handleDownloadExcel = () => {
    downloadCatalogMutation.mutate(
      {},
      {
        onSuccess: () => {
          toast('Excel file downloaded successfully!');
        },
        onError: (error) => {
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
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
            <ButtonActions
              hrefDetail={`/master-capex/catalogs/${cell.row.values.id}/detail`}
              hrefEdit={`/master-capex/catalogs/${cell.row.values.id}/edit`}
              onDelete={() => {
                if (confirm('Delete data?'))
                  deleteCatalog([cell.row.values.id]);
              }}
            ></ButtonActions>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFilterChange = (val: OptionsType<SelectOption>) => {
    const params = val.map((item) => {
      return item.value;
    });

    setFiltersParams('assetGroupId', params?.join() || '');
  };

  return (
    <ContentLayout
      title="Catalog"
      controls={
        <>
          <LoadingButton
            className="mr-md-2 mb-2 mb-md-0"
            disabled={downloadCatalogMutation.isLoading}
            onClick={handleDownloadExcel}
            isLoading={downloadCatalogMutation.isLoading}
          >
            Download
          </LoadingButton>
          <Link href={`/master-capex/catalogs/upload`} passHref>
            <Button className="mr-md-2 mb-2 mb-md-0">Upload</Button>
          </Link>
          <Link href={`/master-capex/catalogs/create`} passHref>
            <Button>+ Create</Button>
          </Link>
        </>
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
                        isMulti
                        isClearable
                        options={assetGroupOptions}
                        styles={{
                          ...customStyles(),
                          menu: () => ({
                            zIndex: 99,
                          }),
                        }}
                        onChange={(val) => handleFilterChange(val)}
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
