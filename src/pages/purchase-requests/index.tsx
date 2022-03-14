import { customStyles } from 'components/form/SingleSelect';
import ButtonActions from 'components/ui/Button/ButtonActions';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { overBudgetStatusOptions } from 'constants/status';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { PurchaseRequest } from 'modules/purchaseRequest/entities';
import { useFetchPurchaseRequests } from 'modules/purchaseRequest/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { CellProps, Column, SortingRule } from 'react-table';

const PurchaseRequestsIndex: NextPage = () => {
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

  const dataHook = useFetchPurchaseRequests(params);
  const disabledRowIds = useMemo<string[]>(
    () =>
      dataHook.data?.items
        .filter((item) => item.status !== 'DRAFT')
        .map((item) => item.id) || [],
    [dataHook.data]
  );

  const columns = useMemo<Column<PurchaseRequest>[]>(
    () => [
      {
        Header: 'PR Number',
        accessor: 'prNumber',
      },
      {
        Header: 'PR Number Ellipse',
        accessor: 'prNumberEllipse',
      },
      {
        Header: 'Currency',
        accessor: 'currency',
      },
      {
        Header: 'Quantity Required',
        accessor: 'quantityRequired',
      },
      {
        Header: 'Estimate Price (USD)',
        accessor: 'estimatedPriceUsd',
      },
      {
        Header: 'Requested By',
        accessor: 'requestedBy',
      },
      {
        Header: 'Supplier Option Code',
        accessor: 'supplierRecommendation',
      },
      {
        Header: 'Supplier Option Name',
        accessor: 'supplierRecommendationName',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Actions',
        Cell: ({ cell }: CellProps<PurchaseRequest>) => {
          return (
            <ButtonActions
              hrefDetail={`/purchase-requests/${cell.row.values.id}/detail`}
              hrefEdit={`/purchase-requests/${cell.row.values.id}/edit`}
              // TODO: add handle delete
              // onDelete
            />
          );
        },
      },
    ],
    []
  );

  return (
    <ContentLayout
      title="Purchase Requests"
      controls={
        <Link href={`/purchase-requests/create`} passHref>
          <Button>+ Create</Button>
        </Link>
      }
    >
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            data={dataHook?.data}
            classThead="text-nowrap"
            isLoading={dataHook.isLoading}
            disabledRowIds={disabledRowIds}
            actions={
              <>
                <LoadingButton
                  variant="red"
                  size="sm"
                  className="mr-2"
                  disabled={false}
                  // TODO: add handle delete
                  // onClick={() => handleDeleteMultiplePurchaseRequests}
                  isLoading={false}
                >
                  Delete
                </LoadingButton>
                <LoadingButton
                  variant="primary"
                  size="sm"
                  className="mr-2"
                  disabled={false}
                  // TODO: add handle submit
                  // onClick={handleMultipleSubmitPurchaseRequests}
                  isLoading={false}
                >
                  Submit
                </LoadingButton>
              </>
            }
            filters={
              <Col lg={12} className="mb-32 px-0">
                <div className="setup-detail p-4">
                  <Row>
                    <Col lg={6}>
                      <p className="mb-1">Status</p>
                      <Select
                        placeholder="Select Status"
                        isClearable
                        // TODO: confirm statusnya apa aja
                        options={overBudgetStatusOptions}
                        styles={{
                          ...customStyles(),
                          menu: () => ({
                            zIndex: 99,
                          }),
                        }}
                        onChange={(val) =>
                          setFiltersParams(
                            'status',
                            (val?.value as string) || ''
                          )
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            }
            selectedSort={selectedSort}
            selectedRows={selectedRow}
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

export default PurchaseRequestsIndex;
