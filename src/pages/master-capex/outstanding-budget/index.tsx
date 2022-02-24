import { customStyles } from 'components/form/SingleSelect';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import ConfirmationModal from 'components/ui/Modal/OutstandingBudget/ConfirmationModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import {
  confirmOutstandingBudget,
  confirmOutstandingBudgetField,
  outstandingBudget,
} from 'modules/outstandingBudget/entities';
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
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchOutstandingBudget({
    ...params,
  });

  const mutation = useConfirmationOutstandingBudget();

  const confirmMutation = useConfirmationOutstandingBudget();

  const handleConfirmation = (data: confirmOutstandingBudget) => {
    console.log(data);
    const confirmationData = {
      ...data,
    };
    confirmMutation.mutate(confirmationData, {
      onSuccess: () => {
        dataHook.refetch();
        toast('Confirmation Success!');
      },
      onError: (error) => {
        console.log('Failed to confirm', error);
        toast(error.message);
        showErrorMessage(error);
      },
    });
  };

  const columns = useMemo<Column<outstandingBudget>[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Budget ID',
        accessor: 'budgetId',
        style: {
          minWidth: '250px',
        },
      },
      {
        Header: 'District',
        accessor: 'district',
        style: {
          minWidth: '150px',
        },
      },
      {
        Header: 'Department',
        accessor: 'department',
        style: {
          minWidth: '175px',
        },
      },
      {
        Header: 'Detail',
        accessor: 'detail',
        style: {
          minWidth: '150px',
        },
      },
      {
        Header: 'Left Information',
        accessor: 'leftInformation',
        style: {
          minWidth: '150px',
        },
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
        style: {
          minWidth: '150px',
        },
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
        style: {
          minWidth: '250px',
        },
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
        style: {
          minWidth: '150px',
        },
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
        style: {
          minWidth: '250px',
        },
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
        style: {
          minWidth: '250px',
        },
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
        style: {
          minWidth: '250px',
        },
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
        style: {
          minWidth: '250px',
        },
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
        style: {
          minWidth: '250px',
        },
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
        style: {
          minWidth: '250px',
        },
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
        style: {
          minWidth: '250px',
        },
      },
      {
        Header: 'Realisasi Sisa Budget S1 Current Period',
        accessor: 'adjustedRealisasiSisaBudgetS1CurrentPeriod',
        style: {
          minWidth: '250px',
        },
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
        accessor: 'createdAt',
        style: {
          minWidth: '250px',
        },
        Cell: ({ cell }: CellProps<outstandingBudget>) => {
          return (
            <div className="d-flex flex-column" style={{ minWidth: 150 }}>
              <ConfirmationModal
                onSend={handleConfirmation}
                classButton="mb-0"
                confirmData={{
                  idOutstandingBudgets: [cell.row.values.id],
                  totalPengajuanBudgetUsdS1CurrentPeriod:
                    cell.row.original.totalPengajuanBudgetUsdS1CurrentPeriod,
                  adjustedSisaBudgetUsdS1CurrentPeriod:
                    cell.row.original.adjustedSisaBudgetUsdS1CurrentPeriod,
                  originalQuantity: cell.row.original.originalQuantity,
                  adjustedLeftInformation:
                    cell.row.original.adjustedLeftInformation,
                  realisasiSisaBudgetS1CurrentPeriod:
                    cell.row.original.realisasiSisaBudgetS1CurrentPeriod,
                }}
              />
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ContentLayout title="Outstanding Budgets">
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            data={dataHook.data}
            classThead="text-nowrap"
            isLoading={dataHook.isFetching}
            hiddenColumns={['id']}
            selectedSort={selectedSort}
            paginateParams={params}
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
