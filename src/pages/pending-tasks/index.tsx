import { customStyles } from 'components/form/SingleSelect';
import ContentLayout from 'components/ui/ContentLayout';
import ApproveModal from 'components/ui/Modal/ApproveModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { Currency } from 'constants/currency';
import { overBudgetStatusOptions } from 'constants/status';
import { UserType } from 'constants/user';
import { ApprovalField, ApprovalStatus } from 'modules/approval/entities';
import { BudgetPlanItemGroupStatus } from 'modules/budgetPlanItemGroup/constant';
import { BudgetPlanItemGroup } from 'modules/budgetPlanItemGroup/entities';
import { useBudgetPlanItemGroupHelpers } from 'modules/budgetPlanItemGroup/helpers';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { useFetchPendingTaskBudgetPlanItemGroups } from 'modules/pendingTask/hook';
import moment from 'moment';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { CellProps, Column, SortingRule } from 'react-table';
import { formatMoney, getAllIds } from 'utils/helpers';

const OverBudgetIndex: NextPage = () => {
  const router = useRouter();
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

  const [profile] = useDecodeToken();
  const dataHook = useFetchPendingTaskBudgetPlanItemGroups({
    ...params,
    status:
      profile?.type === UserType.DeptPicAssetHoCapex
        ? BudgetPlanItemGroupStatus.WaitingApprovalPicAssetHo
        : '',
  });

  const { handleApprovalBudgetPlanItemGroup } = useBudgetPlanItemGroupHelpers();
  const approveBudgetPlanItemGroup = (data: ApprovalField) => {
    const ids = getAllIds(selectedRow, dataHook.data);
    if (ids.length > 0) {
      handleApprovalBudgetPlanItemGroup({
        idBudgetPlanItemGroups: ids,
        status: data.status,
      }).then(() => router.push(`/budget-plans/id/detail`));
    }
  };

  const columns: Column<BudgetPlanItemGroup>[] = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Budget Code', accessor: 'budgetCode', minWidth: 300 },
    { Header: 'Units', accessor: 'item', minWidth: 100 },
    { Header: 'Currency', accessor: 'currency' },
    {
      Header: 'Total USD',
      accessor: 'totalAmountUsd',
      Cell: ({ row }: CellProps<BudgetPlanItemGroup>) =>
        formatMoney(row.values.totalAmountUsd, Currency.Usd, '-'),
    },
    {
      Header: 'Total IDR',
      accessor: 'totalAmount',
      Cell: ({ row }: CellProps<BudgetPlanItemGroup>) =>
        formatMoney(row.values.totalAmount, Currency.Idr, '-'),
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }: CellProps<BudgetPlanItemGroup>) => {
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
      Cell: ({ row }: CellProps<BudgetPlanItemGroup>) => {
        return moment(row.values.createdAt).format('YYYY-MM-DD');
      },
    },
    {
      Header: 'Actions',
      Cell: ({ cell }: CellProps<BudgetPlanItemGroup>) => {
        return (
          <div className="d-flex flex-column" style={{ minWidth: 110 }}>
            <Link href={`/budget-plans/id/${cell.row.values.id}`} passHref>
              <Button className="mb-1">Detail</Button>
            </Link>
            <ApproveModal
              onSend={(data) =>
                handleApprovalBudgetPlanItemGroup({
                  idBudgetPlanItemGroups: [cell.row.values.id],
                  status: data.status,
                })
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <ContentLayout title="Pending Tasks">
      <div className="d-md-flex flex-row col-12 text-center">
        <Col lg={3} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Total Planning (USD)</Card.Title>
              <h2 className="m-0">70,000</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Intervene (USD)</Card.Title>
              <h2 className="m-0">70,000</h2>
            </Card.Body>
          </Card>
        </Col>
      </div>
      <Col lg={12}>
        {dataHook.data && (
          <DataTable
            columns={columns}
            data={dataHook?.data}
            classThead="text-nowrap"
            isLoading={dataHook.isFetching}
            hiddenColumns={['id']}
            actions={
              <>
                <ApproveModal
                  onSend={(data) => approveBudgetPlanItemGroup(data)}
                  classButton="mr-2"
                />
              </>
            }
            filters={
              <Col lg={12} className="mb-32 px-0">
                <div className="setup-detail p-4">
                  <Row>
                    <Col lg={6}>
                      <p className="mb-1">Asset Group</p>
                      <Select
                        placeholder="Select Asset Group"
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
                            'assetGroup',
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
