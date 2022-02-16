import { customStyles } from 'components/form/SingleSelect';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { outstandingBudget } from 'modules/outstandingBudget/entities';
import {
  useConfirmationOutstandingBudget,
  useFetchOutstandingBudget,
} from 'modules/outstandingBudget/hook';
import moment from 'moment';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { getAllIds, showErrorMessage } from 'utils/helpers';

const OutstandingBudgets: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchOutstandingBudget({
    ...params,
  });

  const mutation = useConfirmationOutstandingBudget();

  const columns = useMemo<Column<outstandingBudget>[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Budget ID',
        accessor: 'budgetId',
      },
      {
        Header: 'District',
        accessor: 'district',
      },
      {
        Header: 'Department',
        accessor: 'department',
      },
      {
        Header: 'Detail',
        accessor: 'detail',
      },
      {
        Header: 'Left Information',
        accessor: 'leftInformation',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.leftInformation.toLocaleString('id-Id')}
            </div>
          );
        },
      },
      {
        Header: 'Used Information',
        accessor: 'usedInformation',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.usedInformation.toLocaleString('id-Id')}
            </div>
          );
        },
      },
      {
        Header: 'Original Sisa Budget (USD) S1 Current Period',
        accessor: 'originalSisaBudgetUsdS1CurrentPeriod',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.originalSisaBudgetUsdS1CurrentPeriod.toLocaleString(
                'id-Id'
              )}
            </div>
          );
        },
      },
      {
        Header: 'Original Quantity',
        accessor: 'originalQuantity',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.originalQuantity.toLocaleString('id-Id')}
            </div>
          );
        },
      },
      {
        Header: 'Realisasi Sisa Budget S1 Current Period',
        accessor: 'realisasiSisaBudgetS1CurrentPeriod',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.realisasiSisaBudgetS1CurrentPeriod.toLocaleString(
                'id-Id'
              )}
            </div>
          );
        },
      },
      {
        Header: 'Adjusted Left Information',
        accessor: 'adjustedLeftInformation',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.adjustedLeftInformation.toLocaleString('id-Id')}
            </div>
          );
        },
      },
      {
        Header: 'Quantity Realisasi S1 Current Period',
        accessor: 'quantityRealisasiS1CurrentPeriod',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.quantityRealisasiS1CurrentPeriod.toLocaleString(
                'id-Id'
              )}
            </div>
          );
        },
      },
      {
        Header: 'Total Pengajuan Budget (USD) S1 Current Period',
        accessor: 'totalPengajuanBudgetUsdS1CurrentPeriod',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.totalPengajuanBudgetUsdS1CurrentPeriod.toLocaleString(
                'id-Id'
              )}
            </div>
          );
        },
      },
      {
        Header: 'Adjustment Current Period',
        accessor: 'adjustmentCurrentPeriod',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.adjustmentCurrentPeriod.toLocaleString('id-Id')}
            </div>
          );
        },
      },
      {
        Header: 'Adjusted Sisa Budget (USD) S1 Current Period',
        accessor: 'adjustedSisaBudgetUsdS1CurrentPeriod',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.adjustedSisaBudgetUsdS1CurrentPeriod.toLocaleString(
                'id-Id'
              )}
            </div>
          );
        },
      },
      {
        Header: 'Remark',
        accessor: 'adjustmentRemark',
      },
      {
        Header: 'Realisasi Sisa Budget S1 Current Period',
        accessor: 'adjustedRealisasiSisaBudgetS1CurrentPeriod',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="text-right">
              {cell.row.values.adjustedRealisasiSisaBudgetS1CurrentPeriod.toLocaleString(
                'id-Id'
              )}
            </div>
          );
        },
      },
      {
        Header: 'Actions',
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="d-flex flex-column">
              <Button variant="primary">Confirm</Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const handleMultipleConfirmOutstanding = () => {};

  return (
    <ContentLayout title="Outstanding Budgets">
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            data={dataHook.data}
            actions={
              <>
                <LoadingButton
                  variant="primary"
                  size="sm"
                  className="mr-2"
                  disabled={mutation.isLoading}
                  onClick={handleMultipleConfirmOutstanding}
                  isLoading={mutation.isLoading}
                >
                  Confirm
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

export default OutstandingBudgets;
