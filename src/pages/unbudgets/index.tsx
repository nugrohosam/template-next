import { customStyles } from 'components/form/SingleSelect';
import ButtonActions from 'components/ui/Button/ButtonActions';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import {
  UnbudgetStatus,
  UnbudgetStatusOptions,
} from 'modules/unbudget/constant';
import { Unbudget } from 'modules/unbudget/entities';
import { useUnbudgetHelpers } from 'modules/unbudget/helpers';
import { useFetchUnbudgets } from 'modules/unbudget/hook';
import moment from 'moment';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { Badge, Button, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { CellProps, Column, SortingRule } from 'react-table';
import { getAllIds } from 'utils/helpers';

enum ActionUnbudget {
  Submit = 'SUBMIT',
  Delete = 'DELETE',
  Cancel = 'CANCEL',
}

const UnbudgetList: NextPage = () => {
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

  const dataHookUnbudgets = useFetchUnbudgets(params);
  const {
    deleteUnbudgetsMutation,
    handleDeleteUnbudgets,
    submitUnbudgetsMutation,
    handleSubmitUnbudgets,
    cancelUnbudgetsMutation,
    handleCancelUnbudgets,
  } = useUnbudgetHelpers();

  const handleActionMultipleUnbudget = async (action: ActionUnbudget) => {
    const ids = getAllIds(selectedRow, dataHookUnbudgets.data);
    if (ids?.length > 0) {
      if (action === ActionUnbudget.Submit) await handleSubmitUnbudgets(ids);
      else if (action === ActionUnbudget.Delete)
        await handleDeleteUnbudgets(ids);
      else if (action === ActionUnbudget.Cancel)
        await handleCancelUnbudgets(ids);

      setSelectedRow({});
      dataHookUnbudgets.refetch();
    }
  };

  const canSubmit = (status: string) =>
    status === UnbudgetStatus.Draft || status === UnbudgetStatus.Revise;
  const canDelete = (status: string) =>
    status === UnbudgetStatus.Draft || status === UnbudgetStatus.Cancel;
  const canCancel = (status: string) =>
    status === UnbudgetStatus.Draft || status === UnbudgetStatus.Revise;
  const canEdit = (status: string) =>
    status === UnbudgetStatus.Draft || status === UnbudgetStatus.Revise;

  const disableMultipleAction = (canAction: (item: string) => void) => {
    const items =
      Object.keys(selectedRow).map(
        (index) => dataHookUnbudgets.data?.items[parseInt(index)].status
      ) || [];

    return !items.every((item) => canAction(item || ''));
  };

  const columns: Column<Unbudget>[] = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Budget Code', accessor: 'budgetCode', minWidth: 300 },
    { Header: 'Units', accessor: 'item' },
    { Header: 'Currency', accessor: 'currency' },
    {
      Header: 'Total USD',
      accessor: 'totalAmountUsd',
      Cell: ({ row }: CellProps<Unbudget>) =>
        row.values.totalAmountUsd?.toLocaleString('en-EN') || '-',
    },
    {
      Header: 'Total IDR',
      accessor: 'totalAmount',
      Cell: ({ row }: CellProps<Unbudget>) =>
        row.values.totalAmount?.toLocaleString('id-Id') || '-',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }: CellProps<Unbudget>) => {
        return (
          <Badge className="badge--status badge--status-blue">
            {row.values.status}
          </Badge>
        );
      },
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      Cell: ({ row }: CellProps<Unbudget>) => {
        return moment(row.values.createdAt).format('YYYY-MM-DD');
      },
    },
    {
      Header: 'Actions',
      Cell: ({ row }: CellProps<Unbudget>) => {
        return (
          <>
            <ButtonActions
              hrefDetail={`/unbudgets/${row.values.id}/detail`}
              hrefEdit={`/unbudgets/${row.values.id}/edit`}
              disableEdit={!canEdit(row.values.status)}
              onDelete={() => handleDeleteUnbudgets([row.values.id])}
              disableDelete={!canDelete(row.values.status)}
            />
            <LoadingButton
              size="sm"
              className="mt-2 w-100"
              disabled={
                cancelUnbudgetsMutation.isLoading ||
                !canCancel(row.values.status)
              }
              isLoading={cancelUnbudgetsMutation.isLoading}
              onClick={() => handleCancelUnbudgets([row.values.id])}
            >
              Cancel
            </LoadingButton>
          </>
        );
      },
    },
  ];

  return (
    <ContentLayout
      title="Unbudgets"
      controls={
        <Link href={`/unbudgets/create`} passHref>
          <Button>+ Create</Button>
        </Link>
      }
    >
      <Col lg={12}>
        {dataHookUnbudgets.data && (
          <DataTable
            columns={columns}
            data={dataHookUnbudgets.data}
            actions={
              <>
                <LoadingButton
                  variant="red"
                  size="sm"
                  className="mr-2"
                  disabled={
                    deleteUnbudgetsMutation.isLoading ||
                    disableMultipleAction(canDelete)
                  }
                  isLoading={deleteUnbudgetsMutation.isLoading}
                  onClick={() =>
                    handleActionMultipleUnbudget(ActionUnbudget.Delete)
                  }
                >
                  Delete
                </LoadingButton>
                <LoadingButton
                  size="sm"
                  className="mr-2"
                  disabled={
                    submitUnbudgetsMutation.isLoading ||
                    disableMultipleAction(canSubmit)
                  }
                  isLoading={submitUnbudgetsMutation.isLoading}
                  onClick={() =>
                    handleActionMultipleUnbudget(ActionUnbudget.Submit)
                  }
                >
                  Submit
                </LoadingButton>
                <LoadingButton
                  size="sm"
                  className="mr-2"
                  disabled={
                    cancelUnbudgetsMutation.isLoading ||
                    disableMultipleAction(canCancel)
                  }
                  isLoading={cancelUnbudgetsMutation.isLoading}
                  onClick={() =>
                    handleActionMultipleUnbudget(ActionUnbudget.Cancel)
                  }
                >
                  Cancel
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
                        options={UnbudgetStatusOptions}
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
            isLoading={dataHookUnbudgets.isFetching}
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

export default UnbudgetList;
