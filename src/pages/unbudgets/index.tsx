import { customStyles } from 'components/form/SingleSelect';
import ButtonActions from 'components/ui/Button/ButtonActions';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import ApproveModal from 'components/ui/Modal/ApproveModal';
import RejectModal from 'components/ui/Modal/RejectModal';
import ReviseModal from 'components/ui/Modal/ReviseModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { Currency } from 'constants/currency';
import { ApprovalField, ApprovalStatus } from 'modules/approval/entities';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { UnbudgetStatusOptions } from 'modules/unbudget/constant';
import { Unbudget } from 'modules/unbudget/entities';
import {
  permissionUnbudgetHelpers,
  useUnbudgetHelpers,
} from 'modules/unbudget/helpers';
import { useFetchUnbudgets } from 'modules/unbudget/hook';
import moment from 'moment';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { Badge, Button, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { CellProps, Column, SortingRule } from 'react-table';
import { formatMoney, getAllIds } from 'utils/helpers';

enum ActionUnbudget {
  Submit = 'SUBMIT',
  Delete = 'DELETE',
  Cancel = 'CANCEL',
  Approval = 'APPROVAL',
}

const UnbudgetList: NextPage = () => {
  const [profile] = useDecodeToken();
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

  // handle actions
  const {
    mutationDeleteUnbudgets,
    handleDeleteUnbudgets,
    mutationSubmitUnbudgets,
    handleSubmitUnbudgets,
    mutationCancelUnbudgets,
    handleCancelUnbudgets,
    handleApprovalUnbudgets,
  } = useUnbudgetHelpers();
  const handleMultipleActionUnbudget = async (
    action: ActionUnbudget,
    data?: ApprovalField
  ) => {
    const ids = getAllIds(selectedRow, dataHookUnbudgets.data);
    if (ids?.length > 0) {
      if (action === ActionUnbudget.Submit) {
        await handleSubmitUnbudgets(ids);
      } else if (action === ActionUnbudget.Delete) {
        await handleDeleteUnbudgets(ids);
      } else if (action === ActionUnbudget.Cancel) {
        await handleCancelUnbudgets(ids);
      } else if (action === ActionUnbudget.Approval) {
        await handleApprovalUnbudgets({
          idUnbudgets: ids,
          status: data?.status as ApprovalStatus,
          remark: data?.notes,
        });
      }

      setSelectedRow({});
      dataHookUnbudgets.refetch();
    }
  };

  // permisison
  const {
    userCanHandleData,
    userCanApproveData,
    canCancel,
    canDelete,
    canEdit,
    canSubmit,
  } = permissionUnbudgetHelpers(profile?.type);
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
        formatMoney(row.values.totalAmountUsd, Currency.Usd, '-'),
    },
    {
      Header: 'Total IDR',
      accessor: 'totalAmount',
      Cell: ({ row }: CellProps<Unbudget>) =>
        formatMoney(row.values.totalAmount, Currency.Idr, '-'),
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
                mutationCancelUnbudgets.isLoading ||
                !canCancel(row.values.status)
              }
              isLoading={mutationCancelUnbudgets.isLoading}
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
                {userCanHandleData && (
                  <>
                    <LoadingButton
                      variant="red"
                      size="sm"
                      className="mr-2"
                      disabled={
                        mutationDeleteUnbudgets.isLoading ||
                        disableMultipleAction(canDelete)
                      }
                      isLoading={mutationDeleteUnbudgets.isLoading}
                      onClick={() =>
                        handleMultipleActionUnbudget(ActionUnbudget.Delete)
                      }
                    >
                      Delete
                    </LoadingButton>
                    <LoadingButton
                      size="sm"
                      className="mr-2"
                      disabled={
                        mutationSubmitUnbudgets.isLoading ||
                        disableMultipleAction(canSubmit)
                      }
                      isLoading={mutationSubmitUnbudgets.isLoading}
                      onClick={() =>
                        handleMultipleActionUnbudget(ActionUnbudget.Submit)
                      }
                    >
                      Submit
                    </LoadingButton>
                    <LoadingButton
                      size="sm"
                      className="mr-2"
                      disabled={
                        mutationCancelUnbudgets.isLoading ||
                        disableMultipleAction(canCancel)
                      }
                      isLoading={mutationCancelUnbudgets.isLoading}
                      onClick={() =>
                        handleMultipleActionUnbudget(ActionUnbudget.Cancel)
                      }
                    >
                      Cancel
                    </LoadingButton>
                  </>
                )}
                {userCanApproveData && (
                  <>
                    <ApproveModal
                      onSend={(data) =>
                        handleMultipleActionUnbudget(
                          ActionUnbudget.Approval,
                          data
                        )
                      }
                      classButton="mr-2"
                    />
                    <ReviseModal
                      onSend={(data) =>
                        handleMultipleActionUnbudget(
                          ActionUnbudget.Approval,
                          data
                        )
                      }
                      classButton="mr-2"
                    />
                    <RejectModal
                      onSend={(data) =>
                        handleMultipleActionUnbudget(
                          ActionUnbudget.Approval,
                          data
                        )
                      }
                    />
                  </>
                )}
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
