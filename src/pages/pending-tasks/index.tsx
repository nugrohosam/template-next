import { customStyles } from 'components/form/SingleSelect';
import ContentLayout from 'components/ui/ContentLayout';
import ApproveModal from 'components/ui/Modal/ApproveModal';
import RejectModal from 'components/ui/Modal/RejectModal';
import ReviseModal from 'components/ui/Modal/ReviseModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import { Currency } from 'constants/currency';
import { UserType } from 'constants/user';
import { ApprovalField, ApprovalStatus } from 'modules/approval/entities';
import { BudgetPlanItemGroupStatus } from 'modules/budgetPlanItemGroup/constant';
import {
  permissionBudgetPlanItemGroupHelpers,
  useBudgetPlanItemGroupHelpers,
} from 'modules/budgetPlanItemGroup/helpers';
import { useAssetGroupOptions } from 'modules/custom/useAssetGroupOptions';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import { PendingTask } from 'modules/pendingTask/entities';
import { useFetchPendingTaskBudgetPlanItemGroups } from 'modules/pendingTask/hook';
import moment from 'moment';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { BsFillEyeFill, BsPencilSquare } from 'react-icons/bs';
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
  const [assetGroupOptions] = useAssetGroupOptions();

  // permission
  const { canApprove } = permissionBudgetPlanItemGroupHelpers(profile?.type);
  const disableMultipleAction = (canAction: (item: string) => void) => {
    const items =
      Object.keys(selectedRow).map(
        (index) => dataHook.data?.items[parseInt(index)].status
      ) || [];

    return !items.every((item) => canAction(item || ''));
  };

  const { handleApprovalBudgetPlanItemGroup } = useBudgetPlanItemGroupHelpers();
  const handleMultipleApproval = (data?: ApprovalField) => {
    const ids = getAllIds(selectedRow, dataHook.data);
    if (ids?.length > 0) {
      handleApprovalBudgetPlanItemGroup({
        idBudgetPlanItemGroups: ids,
        status: data?.status as ApprovalStatus,
        remark: data?.notes,
      });

      setSelectedRow({});
      dataHook.refetch();
    }
  };

  const columns: Column<PendingTask>[] = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Budget Code', accessor: 'budgetCode', minWidth: 300 },
    { Header: 'Asset Group', accessor: 'assetGroup', minWidth: 300 },
    { Header: 'Units', accessor: 'item', minWidth: 100 },
    { Header: 'Currency', accessor: 'currency' },
    {
      Header: 'Total USD',
      accessor: 'totalAmountUsd',
      Cell: ({ row }: CellProps<PendingTask>) =>
        formatMoney(row.values.totalAmountUsd, Currency.Usd, '-'),
    },
    {
      Header: 'Total IDR',
      accessor: 'totalAmount',
      Cell: ({ row }: CellProps<PendingTask>) =>
        formatMoney(row.values.totalAmount, Currency.Idr, '-'),
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }: CellProps<PendingTask>) => {
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
      Cell: ({ row }: CellProps<PendingTask>) => {
        return moment(row.values.createdAt).format('YYYY-MM-DD');
      },
    },
    {
      Header: 'Actions',
      accessor: 'budgetPlanId',
      Cell: ({ cell }: CellProps<PendingTask>) => {
        return (
          <div className="d-flex">
            <Link
              href={`/budget-plans/${cell.row.values.budgetPlanId}/${cell.row.values.id}`}
              passHref
            >
              <Button className="d-flex mr-2">
                <BsFillEyeFill className="align-self-center" />
              </Button>
            </Link>
            {profile?.type === UserType.DeptPicAssetHoCapex && (
              <Link
                href={`/budget-plans/${cell.row.values.budgetPlanId}/${cell.row.values.id}/edit`}
                passHref
              >
                <Button className="mr-2 d-flex" variant="info">
                  <BsPencilSquare className="align-self-center" />
                </Button>
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <ContentLayout title="Pending Tasks">
      <div className="d-md-flex flex-row col-12 text-center">
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Total Planning (USD)</Card.Title>
              <h2 className="m-0">70,000</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
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
                  disabledToggle={disableMultipleAction(canApprove)}
                  onSend={(data) => handleMultipleApproval(data)}
                  classButton="mr-2"
                />
                <ReviseModal
                  disabledToggle={disableMultipleAction(canApprove)}
                  onSend={(data) => handleMultipleApproval(data)}
                  classButton="mr-2"
                />
                <RejectModal
                  disabledToggle={disableMultipleAction(canApprove)}
                  onSend={(data) => handleMultipleApproval(data)}
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
                        options={assetGroupOptions}
                        styles={{
                          ...customStyles(),
                          menu: () => ({
                            zIndex: 99,
                          }),
                        }}
                        onChange={(val) =>
                          setFiltersParams(
                            'idAssetGroup',
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
