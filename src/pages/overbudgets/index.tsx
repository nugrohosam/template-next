import { customStyles } from 'components/form/SingleSelect';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import ApproveModal from 'components/ui/Modal/ApproveModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { OverBudgetStatus, overBudgetStatusOptions } from 'constants/status';
import { UserType } from 'constants/user';
import { ApprovalField } from 'modules/approval/entities';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { OverBudget } from 'modules/overbudget/entities';
import {
  useApprovalOverbudgets,
  useDeleteOverBudgets,
  useFetchOverBudgets,
  useSubmitOverbudgets,
} from 'modules/overbudget/hook';
import moment from 'moment';
import { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { BsFillEyeFill, BsPencilSquare, BsTrash2Fill } from 'react-icons/bs';
import Select from 'react-select';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { getAllIds, showErrorMessage } from 'utils/helpers';

const OverBudgetIndex: NextPage = () => {
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

  const dataHook = useFetchOverBudgets(params);
  const [profile] = useDecodeToken();
  const dataEditable = (status: string) => {
    return (
      status === OverBudgetStatus.DRAFT || status === OverBudgetStatus.REVISE
    );
  };

  const deleteOverBudgetMutation = useDeleteOverBudgets();
  const deleteOverBudget = (ids: Array<string>, action: string) => {
    const actionMessage = action === 'DELETE' ? 'Deleted' : 'Canceled';
    deleteOverBudgetMutation.mutate(
      { idOverbudgets: ids, action },
      {
        onSuccess: () => {
          setSelectedRow({});
          dataHook.refetch();
          toast(`Data ${actionMessage}!`);
        },
        onError: (error) => {
          console.log('Failed to process data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

  const handleDeleteMultipleOverBudgets = (action: string) => {
    const ids = getAllIds(selectedRow, dataHook.data) as string[];
    if (confirm(`${action} selected data?`) && ids) {
      deleteOverBudget(ids, action.toUpperCase());
    }
  };

  const approvalOverbudgetsMutation = useApprovalOverbudgets();
  const approvalOverbudgets = (
    data: ApprovalField & { idOverbudgets: Array<string> }
  ) => {
    approvalOverbudgetsMutation.mutate(
      {
        idOverbudgets: data.idOverbudgets,
        status: data.status,
      },
      {
        onSuccess: () => {
          dataHook.refetch();
          toast('Data approved!');
        },
        onError: (error) => {
          console.log('Failed to approve data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

  const handleMultipleApprovalOverbudgets = (data: ApprovalField) => {
    const ids = getAllIds(selectedRow, dataHook.data) as string[];
    if (ids) {
      approvalOverbudgets({
        idOverbudgets: ids,
        status: data.status,
      });
    }
  };

  const submitOverbudgetsMutation = useSubmitOverbudgets();
  const submitOverbudgets = (idOverbudgets: Array<string>) => {
    submitOverbudgetsMutation.mutate(
      { idOverbudgets },
      {
        onSuccess: () => {
          dataHook.refetch();
          toast('Data submited!');
        },
        onError: (error) => {
          console.log('Failed to submit data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

  const handleMultipleSubmitOverbudgets = () => {
    const ids = getAllIds(selectedRow, dataHook.data) as string[];
    if (confirm('Submit selected data?') && ids) {
      submitOverbudgets(ids);
    }
  };

  const columns = useMemo<Column<OverBudget>[]>(
    () => [
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
      },
      {
        Header: 'Over Budget',
        accessor: 'overBudget',
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        Cell: ({ cell }: CellProps<OverBudget>) => {
          return (
            <span>
              {moment(cell.row.values.createdAt).format('YYYY-MM-DD')}
            </span>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Action',
        accessor: 'id',
        minWidth: 120,
        Cell: ({ cell }: CellProps<OverBudget>) => {
          return (
            <>
              <div className="d-flex">
                <Link
                  href={`/overbudgets/${cell.row.values.id}/detail`}
                  passHref
                >
                  <Button className="d-flex mr-2">
                    <BsFillEyeFill className="align-self-center" />
                  </Button>
                </Link>
                {profile?.type !== UserType.ApprovalBudgetPlanCapex && (
                  <>
                    {dataEditable(cell.row.values.status) && (
                      <Link
                        href={`/overbudgets/${cell.row.values.id}/edit`}
                        passHref
                      >
                        <Button className="mr-2 d-flex" variant="info">
                          <BsPencilSquare className="align-self-center" />
                        </Button>
                      </Link>
                    )}
                    {(dataEditable(cell.row.values.status) ||
                      cell.row.values.status === OverBudgetStatus.CANCEL) && (
                      <Button
                        className="d-flex"
                        variant="red"
                        onClick={() => {
                          if (confirm('Delete data?'))
                            deleteOverBudget([cell.row.values.id], 'DELETE');
                        }}
                      >
                        <BsTrash2Fill className="align-self-center" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
            data={dataHook?.data}
            classThead="text-nowrap"
            isLoading={dataHook.isFetching}
            actions={
              <>
                {profile?.type !== UserType.ApprovalBudgetPlanCapex && (
                  <>
                    <LoadingButton
                      variant="red"
                      size="sm"
                      className="mr-2"
                      disabled={deleteOverBudgetMutation.isLoading}
                      onClick={() => handleDeleteMultipleOverBudgets('Delete')}
                      isLoading={false}
                    >
                      Delete
                    </LoadingButton>
                    <LoadingButton
                      variant="orange"
                      size="sm"
                      className="mr-2"
                      disabled={deleteOverBudgetMutation.isLoading}
                      onClick={() => handleDeleteMultipleOverBudgets('Cancel')}
                      isLoading={false}
                    >
                      Cancel
                    </LoadingButton>
                    <LoadingButton
                      variant="primary"
                      size="sm"
                      className="mr-2"
                      disabled={submitOverbudgetsMutation.isLoading}
                      onClick={handleMultipleSubmitOverbudgets}
                      isLoading={false}
                    >
                      Submit
                    </LoadingButton>
                  </>
                )}
                {profile?.type === UserType.ApprovalBudgetPlanCapex && (
                  <>
                    <ApproveModal
                      onSend={(data) => handleMultipleApprovalOverbudgets(data)}
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

export default OverBudgetIndex;
