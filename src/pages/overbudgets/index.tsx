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
import { overbudgetStatusOptions } from 'modules/overbudget/constant';
import { Overbudget } from 'modules/overbudget/entities';
import {
  permissionOverbudgetHelpers,
  useOverbudgetHelpers,
} from 'modules/overbudget/helpers';
import { useFetchOverbudgets } from 'modules/overbudget/hook';
import moment from 'moment';
import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { Badge, Button, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { CellProps, Column, SortingRule } from 'react-table';
import { formatMoney, getAllIds } from 'utils/helpers';

enum OverbudgetAction {
  Submit = 'SUBMIT',
  Delete = 'DELETE',
  Cancel = 'CANCEL',
  Approval = 'APPROVAL',
}

const OverbudgetIndex: NextPage = () => {
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

  const dataHook = useFetchOverbudgets(params);
  const [profile] = useDecodeToken();

  // permission
  const {
    userCanHandleData,
    userCanApproveData,
    canSubmit,
    canCancel,
    canDelete,
    canEdit,
  } = permissionOverbudgetHelpers(profile?.type);

  const {
    mutationSubmitOverbudgets,
    handleSubmitOverbudgets,
    mutationCancelOrDeleteOverbudgets,
    handleCancelOrDeleteOverbudgets,
    handleApprovalOverbudgets,
  } = useOverbudgetHelpers();

  const handleMultipleActionOverbudget = async (
    action: OverbudgetAction,
    data?: ApprovalField
  ) => {
    const ids = getAllIds(selectedRow, dataHook.data);
    if (ids.length > 0) {
      if (action === OverbudgetAction.Submit) {
        await handleSubmitOverbudgets(ids);
      } else if (
        action === OverbudgetAction.Delete ||
        action === OverbudgetAction.Cancel
      ) {
        await handleCancelOrDeleteOverbudgets(ids, action);
      } else if (action === OverbudgetAction.Approval) {
        await handleApprovalOverbudgets({
          idOverbudgets: ids,
          status: data?.status as ApprovalStatus,
          remark: data?.notes,
        });
      }

      setSelectedRow({});
      dataHook.refetch();
    }
  };

  const handleSingleDeleteOverbudget = (idOverbudget: string) => {
    if (confirm('Delete data?')) {
      handleCancelOrDeleteOverbudgets([idOverbudget], OverbudgetAction.Delete);
      dataHook.refetch();
    }
  };

  const disableMultipleAction = (canAction: (item: string) => void) => {
    const items =
      Object.keys(selectedRow).map(
        (index) => dataHook?.data?.items[parseInt(index)].status
      ) || [];

    return !items.every((item) => canAction(item || ''));
  };

  const columns: Column<Overbudget>[] = [
    { Header: 'Id', accessor: 'id' },
    {
      Header: 'Overbudget Number',
      accessor: 'overBudgetNumber',
    },
    {
      Header: 'Budget Reference',
      accessor: 'budgetReference',
    },
    {
      Header: 'Additional Budget/Unit',
      accessor: 'additionalBudgetPerUnit',
      Cell: ({ row }: CellProps<Overbudget>) => {
        return (
          // TODO: currency budgetRef(?)
          formatMoney(row.values.additionalBudgetPerUnit, Currency.Idr)
        );
      },
    },
    {
      Header: 'Over Budget',
      accessor: 'overBudget',
      Cell: ({ row }: CellProps<Overbudget>) => {
        return formatMoney(row.values.overBudget, Currency.Idr);
      },
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      Cell: ({ cell }: CellProps<Overbudget>) => {
        return (
          <span>{moment(cell.row.values.createdAt).format('YYYY-MM-DD')}</span>
        );
      },
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }: CellProps<Overbudget>) => {
        return (
          <Badge className="badge--status badge--status-blue">
            {row.values.status}
          </Badge>
        );
      },
    },
    {
      Header: 'Actions',
      Cell: ({ row }: CellProps<Overbudget>) => {
        return (
          <>
            <ButtonActions
              hrefDetail={`/overbudgets/${row.values.id}/detail`}
              hrefEdit={`/overbudgets/${row.values.id}/edit`}
              disableEdit={!canEdit(row.values.status)}
              onDelete={() => handleSingleDeleteOverbudget(row.values.id)}
              disableDelete={!canDelete(row.values.status)}
            />
          </>
        );
      },
    },
  ];

  return (
    <ContentLayout
      title="Overbudgets"
      controls={
        <Link href={`/overbudgets/create`} passHref>
          <Button>+ Create</Button>
        </Link>
      }
    >
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            hiddenColumns={['id']}
            data={dataHook?.data}
            classThead="text-nowrap"
            isLoading={dataHook.isFetching}
            actions={
              <>
                {userCanHandleData && (
                  <>
                    <LoadingButton
                      variant="red"
                      size="sm"
                      className="mr-2"
                      disabled={
                        mutationCancelOrDeleteOverbudgets.isLoading ||
                        disableMultipleAction(canDelete)
                      }
                      onClick={() => {
                        if (confirm('Delete selected data?'))
                          handleMultipleActionOverbudget(
                            OverbudgetAction.Delete
                          );
                      }}
                      isLoading={mutationCancelOrDeleteOverbudgets.isLoading}
                    >
                      Delete
                    </LoadingButton>
                    <LoadingButton
                      variant="orange"
                      size="sm"
                      className="mr-2"
                      disabled={
                        mutationCancelOrDeleteOverbudgets.isLoading ||
                        disableMultipleAction(canCancel)
                      }
                      onClick={() => {
                        if (confirm('Cancel selected data?'))
                          handleMultipleActionOverbudget(
                            OverbudgetAction.Cancel
                          );
                      }}
                      isLoading={mutationCancelOrDeleteOverbudgets.isLoading}
                    >
                      Cancel
                    </LoadingButton>
                    <LoadingButton
                      variant="primary"
                      size="sm"
                      className="mr-2"
                      disabled={
                        mutationSubmitOverbudgets.isLoading ||
                        disableMultipleAction(canSubmit)
                      }
                      onClick={() => {
                        if (confirm('Submit selected data?'))
                          handleMultipleActionOverbudget(
                            OverbudgetAction.Submit
                          );
                      }}
                      isLoading={mutationSubmitOverbudgets.isLoading}
                    >
                      Submit
                    </LoadingButton>
                  </>
                )}
                {userCanApproveData && (
                  <>
                    <ApproveModal
                      onSend={(data) =>
                        handleMultipleActionOverbudget(
                          OverbudgetAction.Approval,
                          data
                        )
                      }
                      classButton="mr-2"
                    />
                    <ReviseModal
                      onSend={(data) =>
                        handleMultipleActionOverbudget(
                          OverbudgetAction.Approval,
                          data
                        )
                      }
                      classButton="mr-2"
                    />
                    <RejectModal
                      onSend={(data) =>
                        handleMultipleActionOverbudget(
                          OverbudgetAction.Approval,
                          data
                        )
                      }
                      classButton="mr-2"
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
                        options={overbudgetStatusOptions}
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

export default OverbudgetIndex;
