import ContentLayout from 'components/ui/ContentLayout';
import ModalBox from 'components/ui/Modal';
import ConfirmationModal from 'components/ui/Modal/ConfirmationModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import {
  ConfirmationField,
  OutstandingPrPo,
  OutstandingPrPoConfirmation,
} from 'modules/outstandingprpo/entities';
import {
  useConfirmOutstandingPrPo,
  useFetchOutstandingPrPo,
} from 'modules/outstandingprpo/hook';
import { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

const OutstandingPrPoIndex: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);

  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchOutstandingPrPo(params);

  const columns = useMemo<Column<OutstandingPrPo>[]>(
    () => [
      {
        Header: 'PR Capex',
        accessor: 'prCapex',
      },
      {
        Header: 'District',
        accessor: 'district',
      },
      {
        Header: 'Budget ID',
        accessor: 'budgetId',
      },
      {
        Header: 'PR Item',
        accessor: 'prItem',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Amout PO',
        accessor: 'amountPo',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Date Created',
        accessor: 'dateCreated',
      },
      {
        Header: 'Date Required',
        accessor: 'dateRequired',
      },
      {
        Header: 'Loading Error',
        accessor: 'loadingError',
      },
      {
        Header: 'Current Status',
        accessor: 'currentStatus',
      },
      {
        Header: 'PR Number',
        accessor: 'prNumber',
      },
      {
        Header: 'PO Number',
        accessor: 'poNumber',
      },
      {
        Header: 'Remark',
        accessor: 'remark',
      },
      {
        Header: 'Action',
        accessor: 'action',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        style: { minWidth: '150px' },
        Cell: ({ cell }: CellProps<OutstandingPrPo>) => {
          return (
            <>
              {cell.row.original.adjustmentCurrentPeriod === null && (
                <div className="d-flex flex-column">
                  <ConfirmationModal
                    onSend={handleConfirm}
                    confirmData={{
                      amountAdjustment: cell.row.original.amountPo,
                      idOutstandingPrPo: [cell.row.values.id],
                    }}
                  />
                </div>
              )}
              {cell.row.original.adjustmentCurrentPeriod !== null && (
                <Badge className="badge--status badge--status-green">
                  Confirmed
                </Badge>
              )}
            </>
          );
        },
      },
    ],
    []
  );

  const confirmMutation = useConfirmOutstandingPrPo();

  const handleConfirm = (data: OutstandingPrPoConfirmation) => {
    const confirmationData = {
      ...data,
      amountAdjustment: Number(data.amountAdjustment),
      adjustmentCurrentPeriod: Number(data.adjustmentCurrentPeriod),
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

  return (
    <ContentLayout title="Outstanding PR PO">
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            data={dataHook?.data}
            isLoading={dataHook.isFetching}
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

export default OutstandingPrPoIndex;
