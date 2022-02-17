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
import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Column } from 'react-table';
import { toast } from 'react-toastify';
import { showErrorMessage } from 'utils/helpers';

interface MyBudgetPlanItem extends ItemOfBudgetPlanItemForm {
  jan: string | number;
  feb: string | number;
  mar: string | number;
  apr: string | number;
  mei: string | number;
  jun: string | number;
  jul: string | number;
  aug: string | number;
  sep: string | number;
  oct: string | number;
  nov: string | number;
  dec: string | number;
}

const CreatePeriodActual: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});

  const breadCrumb: PathBreadcrumb[] = [
    {
      label: 'Detail',
      link: `/budget-plan/${id}/detail`,
    },
    {
      label: 'Create Items',
      active: true,
    },
  ];

  const mutation = useCreateBudgetPlanItems();

  const [myBudgetPlanItem, setMyBudgetPlanItem] = useState<MyBudgetPlanItem[]>(
    []
  );

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

  const columns = useMemo<Column<MyBudgetPlanItem>[]>(
    () => [
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
        Header: 'Jan',
        accessor: 'jan',
        minWidth: 100,
      },
      {
        Header: 'Feb',
        accessor: 'feb',
        minWidth: 100,
      },
      {
        Header: 'Mar',
        accessor: 'mar',
        minWidth: 100,
      },
      {
        Header: 'Apr',
        accessor: 'apr',
        minWidth: 100,
      },
      {
        Header: 'Mei',
        accessor: 'mei',
        minWidth: 100,
      },
      {
        Header: 'Jun',
        accessor: 'jun',
        minWidth: 100,
      },
      {
        Header: 'Jul',
        accessor: 'jul',
        minWidth: 100,
      },
      {
        Header: 'Aug',
        accessor: 'aug',
        minWidth: 100,
      },
      {
        Header: 'Sep',
        accessor: 'sep',
        minWidth: 100,
      },
      {
        Header: 'Oct',
        accessor: 'oct',
        minWidth: 100,
      },
      {
        Header: 'Nov',
        accessor: 'nov',
        minWidth: 100,
      },
      {
        Header: 'Dec',
        accessor: 'dec',
        minWidth: 100,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [myBudgetPlanItem]
  );

  const addedItem = (data: ItemOfBudgetPlanItemForm) => {
    setMyBudgetPlanItem((prev) => [
      ...prev,
      {
        ...data,
        jan: data.items.find((item) => item.month === 1)?.quantity || '',
        feb: data.items.find((item) => item.month === 2)?.quantity || '',
        mar: data.items.find((item) => item.month === 3)?.quantity || '',
        apr: data.items.find((item) => item.month === 4)?.quantity || '',
        mei: data.items.find((item) => item.month === 5)?.quantity || '',
        jun: data.items.find((item) => item.month === 6)?.quantity || '',
        jul: data.items.find((item) => item.month === 7)?.quantity || '',
        aug: data.items.find((item) => item.month === 8)?.quantity || '',
        sep: data.items.find((item) => item.month === 9)?.quantity || '',
        oct: data.items.find((item) => item.month === 10)?.quantity || '',
        nov: data.items.find((item) => item.month === 11)?.quantity || '',
        dec: data.items.find((item) => item.month === 12)?.quantity || '',
      },
    ]);
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
      backButtonClick={() => router.replace(`/budget-plan/${id}/detail`)}
      title="Budget Plan Items Create"
    >
      <Panel>
        <Row>
          <SimpleTable
            classTable="table-admin table-inherit"
            columns={columns}
            items={myBudgetPlanItem}
            selectedRows={selectedRow}
            onSelectedRowsChanged={(rows) => setSelectedRow(rows)}
            addOns={
              <CreateBudgetPlanItemModal
                onSend={(data) => addedItem(data)}
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
