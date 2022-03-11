import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import ApproveModal from 'components/ui/Modal/ApproveModal';
import RejectModal from 'components/ui/Modal/RejectModal';
import ReviseModal from 'components/ui/Modal/ReviseModal';
import DataTable, { usePaginateParams } from 'components/ui/Table/DataTable';
import Loader from 'components/ui/Table/Loader';
import { Currency } from 'constants/currency';
import { ApprovalField, ApprovalStatus } from 'modules/approval/entities';
import { useFetchBudgetPlanDetail } from 'modules/budgetPlan/hook';
import { BudgetPlanItemGroup } from 'modules/budgetPlanItemGroup/entities';
import {
  permissionBudgetPlanItemGroupHelpers,
  useBudgetPlanItemGroupHelpers,
} from 'modules/budgetPlanItemGroup/helpers';
import { useFetchBudgetPlanItemGroups } from 'modules/budgetPlanItemGroup/hook';
import { useDecodeToken } from 'modules/custom/useDecodeToken';
import moment from 'moment';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Badge, Button, Col, Row } from 'react-bootstrap';
import { CellProps, Column, SortingRule } from 'react-table';
import { formatMoney, getAllIds } from 'utils/helpers';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Budget Plan',
    link: '/budget-plans',
  },
  {
    label: 'Detail',
    active: true,
  },
];

enum ActionBudgetPlanItemGroup {
  Delete = 'DELETE',
  Submit = 'SUBMIT',
  Approval = 'APPROVAL',
}

const DetailBudgetPlan: NextPage = () => {
  const router = useRouter();
  const idBudgetPlan = router.query.id as string;
  const [profile] = useDecodeToken();

  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<SortingRule<any>[]>([]);
  const { params, setPageNumber, setPageSize, setSearch, setSortingRules } =
    usePaginateParams();

  const dataHook = useFetchBudgetPlanDetail(idBudgetPlan);
  const dataHookBudgetPlanItemGroup = useFetchBudgetPlanItemGroups({
    ...params,
    idBudgetPlan: idBudgetPlan,
  });

  // permission
  const { userCanHandleData, userCanApproveData, canSubmit, canApprove } =
    permissionBudgetPlanItemGroupHelpers(profile?.type);
  const disableMultipleAction = (canAction: (item: string) => void) => {
    const items =
      Object.keys(selectedRow).map(
        (index) =>
          dataHookBudgetPlanItemGroup.data?.items[parseInt(index)].status
      ) || [];

    return !items.every((item) => canAction(item || ''));
  };

  // handle actions
  const {
    mutationSubmitBudgetPlanItemGroup,
    handleSubmitBudgetPlanItemGroups,
    mutationDeleteBudgetPlanItemGroup,
    handleDeleteBudgetPlanItemGroups,
    handleApprovalBudgetPlanItemGroup,
  } = useBudgetPlanItemGroupHelpers();
  const handleMultipleAction = async (
    action: ActionBudgetPlanItemGroup,
    data?: ApprovalField
  ) => {
    const ids = getAllIds(selectedRow, dataHookBudgetPlanItemGroup.data);
    if (ids?.length > 0) {
      if (action === ActionBudgetPlanItemGroup.Submit) {
        await handleSubmitBudgetPlanItemGroups(ids);
      } else if (action === ActionBudgetPlanItemGroup.Delete) {
        await handleDeleteBudgetPlanItemGroups(ids);
      } else if (action === ActionBudgetPlanItemGroup.Approval) {
        await handleApprovalBudgetPlanItemGroup({
          idBudgetPlanItemGroups: ids,
          status: data?.status as ApprovalStatus,
          remark: data?.notes,
        });
      }

      setSelectedRow({});
      dataHookBudgetPlanItemGroup.refetch();
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
          <div className="d-flex flex-column" style={{ minWidth: 100 }}>
            <Link
              href={`/budget-plans/${idBudgetPlan}/${cell.row.values.id}`}
              passHref
            >
              <Button className="mb-1">Detail</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Detail Budget Plan"
    >
      <Panel>
        {dataHook.isLoading && <Loader size="sm" />}

        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">District</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.districtCode}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Divisi</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.divisionCode}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Departemen</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.departmentCode}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Year</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.periodYear}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Period</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.periodType}
            </h3>
          </Col>
        </Row>

        <br />

        <Row>
          <Col lg={12}>
            <Link href={`/budget-plans/${idBudgetPlan}/edit`} passHref>
              <Button variant="primary" className="float-right">
                Edit
              </Button>
            </Link>
          </Col>
        </Row>
      </Panel>

      <Panel>
        <Row>
          <Col lg={12} className="d-md-flex mt-40 mb-32 align-items-center">
            <h3 className="mb-3 mb-md-0 text__blue">Budget Plan Item Groups</h3>
            <div className="ml-auto d-flex flex-column flex-md-row">
              <Link
                href={`/budget-plans/${idBudgetPlan}/create-items`}
                passHref
              >
                <Button className="mb-1">+ Add Item</Button>
              </Link>
            </div>
          </Col>

          {dataHookBudgetPlanItemGroup.data && (
            <DataTable
              columns={columns}
              data={dataHookBudgetPlanItemGroup.data}
              actions={
                <>
                  {userCanHandleData && (
                    <>
                      <LoadingButton
                        variant="red"
                        size="sm"
                        className="mr-2"
                        disabled={mutationDeleteBudgetPlanItemGroup.isLoading}
                        isLoading={mutationDeleteBudgetPlanItemGroup.isLoading}
                        onClick={() =>
                          handleMultipleAction(ActionBudgetPlanItemGroup.Delete)
                        }
                      >
                        Delete
                      </LoadingButton>
                      <LoadingButton
                        size="sm"
                        className="mr-2"
                        disabled={
                          mutationSubmitBudgetPlanItemGroup.isLoading ||
                          disableMultipleAction(canSubmit)
                        }
                        isLoading={mutationSubmitBudgetPlanItemGroup.isLoading}
                        onClick={() =>
                          handleMultipleAction(ActionBudgetPlanItemGroup.Submit)
                        }
                      >
                        Submit
                      </LoadingButton>
                    </>
                  )}
                  {userCanApproveData && (
                    <>
                      <ApproveModal
                        disabledToggle={disableMultipleAction(canApprove)}
                        onSend={(data) =>
                          handleMultipleAction(
                            ActionBudgetPlanItemGroup.Approval,
                            data
                          )
                        }
                        classButton="mr-2"
                      />
                      <ReviseModal
                        disabledToggle={disableMultipleAction(canApprove)}
                        onSend={(data) =>
                          handleMultipleAction(
                            ActionBudgetPlanItemGroup.Approval,
                            data
                          )
                        }
                        classButton="mr-2"
                      />
                      <RejectModal
                        disabledToggle={disableMultipleAction(canApprove)}
                        onSend={(data) =>
                          handleMultipleAction(
                            ActionBudgetPlanItemGroup.Approval,
                            data
                          )
                        }
                      />
                    </>
                  )}
                </>
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
            ></DataTable>
          )}
        </Row>
      </Panel>
    </DetailLayout>
  );
};

export default DetailBudgetPlan;
