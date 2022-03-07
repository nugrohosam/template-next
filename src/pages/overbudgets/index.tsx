import { customStyles } from 'components/form/SingleSelect';
import ButtonActions from 'components/ui/Button/ButtonActions';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import ApproveModal from 'components/ui/Modal/ApproveModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { overBudgetStatusOptions } from 'constants/status';
import { UserType } from 'constants/user';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { OverBudget } from 'modules/overbudget/entities';
import {
  useDeleteOverBudgets,
  useFetchOverBudgets,
} from 'modules/overbudget/hook';
import moment from 'moment';
import { NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
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

  const deleteOverBudgetMutation = useDeleteOverBudgets();
  const deleteOverBudget = (ids: Array<string>) => {
    deleteOverBudgetMutation.mutate(
      { idOverbudgets: ids, action: 'DELETE' },
      {
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
      }
    );
  };

  const handleDeleteMultipleOverBudgets = () => {
    const ids = getAllIds(selectedRow, dataHook.data) as string[];
    if (confirm('Delete selected data?') && ids) {
      deleteOverBudget(ids);
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
              <ButtonActions
                hrefDetail={`/overbudgets/${cell.row.values.id}/detail`}
                hrefEdit={`/overbudgets/${cell.row.values.id}/edit`}
                onDelete={() => {
                  if (confirm('Delete data?'))
                    deleteOverBudget([cell.row.values.id]);
                }}
              />
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
                      onClick={handleDeleteMultipleOverBudgets}
                      isLoading={false}
                    >
                      Delete
                    </LoadingButton>
                    <LoadingButton
                      variant="primary"
                      size="sm"
                      className="mr-2"
                      // disabled={mutation.isLoading}
                      // onClick={handleDeleteMultipleBudgetPeriod}
                      isLoading={false}
                    >
                      Submit
                    </LoadingButton>
                  </>
                )}
                {profile?.type === UserType.ApprovalBudgetPlanCapex && (
                  <>
                    <ApproveModal
                      // onSend={(data) =>
                      //   handleApprovaltMultipleBudgetPlanItemsGroups(data)
                      // }
                      onSend={(data) => console.log(data)}
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
