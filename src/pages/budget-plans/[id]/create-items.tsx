import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import LoadingButton from 'components/ui/Button/LoadingButton';
import DetailLayout from 'components/ui/DetailLayout';
import CreateBudgetPlanItemModal from 'components/ui/Modal/CreateBudgetPlanItemModal';
import SimpleTable from 'components/ui/Table/SimpleTable';
import { ItemOfBudgetPlanItemForm } from 'modules/budgetPlanItem/entities';
import { useCreateBudgetPlanItems } from 'modules/budgetPlanItem/hook';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { CellProps, Column } from 'react-table';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

const columns: Column<ItemOfBudgetPlanItemForm>[] = [
  {
    Header: 'Detail',
    minWidth: 300,
    accessor: 'idCapexCatalog',
  },
  {
    Header: 'Currency',
    accessor: 'currency',
    minWidth: 150,
  },
  {
    Header: 'Price/Unit',
    accessor: 'pricePerUnit',
    minWidth: 200,
  },
  {
    Header: 'Total USD',
    accessor: 'totalAmountUsd',
    minWidth: 200,
  },
  {
    Header: 'Total IDR',
    accessor: 'totalAmount',
    minWidth: 200,
  },
  {
    Header: 'Item',
    accessor: 'items',
  },
  {
    Header: 'Jan',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[0]?.quantity || '',
  },
  {
    Header: 'Feb',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[1]?.quantity || '',
  },
  {
    Header: 'Mar',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[2]?.quantity || '',
  },
  {
    Header: 'Apr',
    minWidth: 100,
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[3]?.quantity || '',
  },
  {
    Header: 'Mei',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[4]?.quantity || '',
  },
  {
    Header: 'Jun',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[5]?.quantity || '',
  },
  {
    Header: 'Jul',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[6]?.quantity || '',
  },
  {
    Header: 'Aug',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[7]?.quantity || '',
  },
  {
    Header: 'Sep',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[8]?.quantity || '',
  },
  {
    Header: 'Oct',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[9]?.quantity || '',
  },
  {
    Header: 'Nov',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[10]?.quantity || '',
  },
  {
    Header: 'Dec',
    Cell: ({ row }: CellProps<ItemOfBudgetPlanItemForm>) =>
      row.values.items[11]?.quantity || '',
  },
];

const CreatePeriodActual: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});

  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Detail',
      link: `/budget-plans/${id}/detail`,
    },
    {
      label: 'Create Items',
      active: true,
    },
  ];

  const mutation = useCreateBudgetPlanItems();

  const [myBudgetPlanItem, setMyBudgetPlanItem] = useState<
    ItemOfBudgetPlanItemForm[]
  >([]);

  const handleDeleteMultipleMyBudgetPlanItem = () => {
    setMyBudgetPlanItem((prev) =>
      prev.filter(
        (item, i) =>
          !Object.keys(selectedRow)
            .map((key) => +key)
            .includes(i)
      )
    );
  };

  const submitCreateBudgetPlanItems = () => {
    mutation.mutate(
      {
        idCapexBudgetPlan: id,
        // TODO: isBuilding, outstandingPlanPaymentAttachment, outstandingRetentionAttachment masih hardcode
        isBuilding: true,
        outstandingPlanPaymentAttachment:
          'outstanding_plan_payment_attachment.xlsx',
        outstandingRetentionAttachment: 'outstanding_retention_attachment.xlsx',
        budgetPlanItems: myBudgetPlanItem.map((item) => ({
          idCapexCatalog: item.idCapexCatalog,
          idAssetGroup: item.idAssetGroup,
          pricePerUnit: item.pricePerUnit,
          currency: item.currency,
          currencyRate: item.currencyRate,
          totalAmount: item.totalAmount,
          totalAmountUsd: item.totalAmountUsd,
          items: item.items,
        })),
      },
      {
        onSuccess: () => {
          router.push('/master-capex/asset-groups');
          toast('Data created!');
        },
        onError: (error) => {
          console.error('Failed to create data', error);
          toast(error.message, { autoClose: false });
          showErrorMessage(error);
        },
      }
    );
  };

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={() => router.replace(`/budget-plans/${id}/detail`)}
      title="Budget Plan Items Create"
    >
      <Panel>
        <Row>
          <SimpleTable
            classTable="table-admin table-inherit"
            columns={columns}
            items={myBudgetPlanItem}
            selectedRows={selectedRow}
            hiddenColumns={['items']}
            onSelectedRowsChanged={(rows) => setSelectedRow(rows)}
            addOns={
              <CreateBudgetPlanItemModal
                onSend={(data) =>
                  setMyBudgetPlanItem((prev) => [...prev, data])
                }
              ></CreateBudgetPlanItemModal>
            }
            actions={
              <>
                <Button
                  variant="red"
                  size="sm"
                  className="mr-2"
                  onClick={handleDeleteMultipleMyBudgetPlanItem}
                >
                  Delete
                </Button>
              </>
            }
          />
        </Row>

        <br />

        <Col lg={12} className="d-flex pr-sm-0 justify-content-end">
          <LoadingButton
            variant="primary"
            type="submit"
            disabled={mutation.isLoading}
            isLoading={mutation.isLoading}
            onClick={submitCreateBudgetPlanItems}
          >
            Create
          </LoadingButton>
        </Col>
      </Panel>
    </DetailLayout>
  );
};

export default CreatePeriodActual;
