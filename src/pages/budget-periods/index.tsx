import { customStyles } from 'components/form/SingleSelect';
import ButtonActions from 'components/ui/Button/ButtonActions';
import LoadingButton from 'components/ui/Button/LoadingButton';
import ContentLayout from 'components/ui/ContentLayout';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { periodePositionOptions, periodeStatusOptions } from 'constants/period';
import { BudgetPeriod } from 'modules/budgetPeriod/entities';
import {
  useDeleteBudgetPeriods,
  useFetchBudgetPeriod,
} from 'modules/budgetPeriod/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { CellProps, Column, SortingRule } from 'react-table';
import { toast } from 'react-toastify';
import { getAllIds, showErrorMessage } from 'utils/helpers';

const BudgetPeriodIndex: NextPage = () => {
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

  const dataHook = useFetchBudgetPeriod(params);
  const mutation = useDeleteBudgetPeriods();

  const deleteBudgetPeriod = (ids: Array<string>) => {
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

  const handleDeleteMultipleBudgetPeriod = () => {
    const ids = getAllIds(selectedRow, dataHook.data) as string[];
    if (confirm('Delete selected data?') && ids) {
      deleteBudgetPeriod(ids);
    }
  };

  const columns: Column<BudgetPeriod>[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'District',
      accessor: 'districtCode',
    },
    {
      Header: 'Year',
      accessor: 'year',
    },
    {
      Header: 'Type',
      accessor: 'type',
    },
    {
      Header: 'Open Date',
      accessor: 'openDate',
    },
    {
      Header: 'Close Date',
      accessor: 'closeDate',
    },
    {
      Header: 'Status',
      accessor: 'status',
    },
    {
      Header: 'Position',
      accessor: 'position',
    },
    {
      Header: 'Actions',
      Cell: ({ cell }: CellProps<BudgetPeriod>) => {
        return (
          <ButtonActions
            hrefDetail={`/budget-periods/${cell.row.values.id}/detail`}
            hrefEdit={`/budget-periods/${cell.row.values.id}/edit`}
            onDelete={() => {
              if (confirm('Delete data?'))
                deleteBudgetPeriod([cell.row.values.id]);
            }}
          />
        );
      },
    },
  ];

  return (
    <ContentLayout
      title="Config Budget Periods"
      controls={
        <Link href={`/budget-periods/create`} passHref>
          <Button>+ Create</Button>
        </Link>
      }
    >
      <Col lg={12}>
        {dataHook?.data && (
          <DataTable
            classThead="text-nowrap"
            columns={columns}
            data={dataHook.data}
            actions={
              <>
                <LoadingButton
                  variant="red"
                  size="sm"
                  className="mr-2"
                  disabled={mutation.isLoading}
                  onClick={handleDeleteMultipleBudgetPeriod}
                  isLoading={mutation.isLoading}
                >
                  Delete
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
                        options={periodeStatusOptions}
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
                    <Col lg={6}>
                      <p className="mb-1 mt-3 mt-lg-0">Position</p>
                      <Select
                        placeholder="Select Position"
                        isClearable
                        options={periodePositionOptions}
                        styles={{
                          ...customStyles(),
                          menu: () => ({
                            zIndex: 99,
                          }),
                        }}
                        onChange={(val) =>
                          setFiltersParams(
                            'position',
                            (val?.value as string) || ''
                          )
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
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
          />
        )}
      </Col>
    </ContentLayout>
  );
};

export default BudgetPeriodIndex;
