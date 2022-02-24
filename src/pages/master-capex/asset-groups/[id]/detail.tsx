import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import Loader from 'components/ui/Table/Loader';
import SimpleTable from 'components/ui/Table/SimpleTable';
import { PicType } from 'constants/picType';
import { AssetGroupPics } from 'modules/assetGroup/entities';
import { useFetchAssetGroupDetail } from 'modules/assetGroup/hook';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { CellProps, Column } from 'react-table';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Asset Group',
    link: '/master-capex/asset-groups',
  },
  {
    label: 'Detail',
    active: true,
  },
];

const columns: Column<AssetGroupPics>[] = [
  { Header: 'District', accessor: 'districtCode' },
  { Header: 'Dept', accessor: 'departementCode' },
  {
    Header: 'Default for Budget Code',
    accessor: 'isBudgetCodeDefault',
    Cell: ({ cell }: CellProps<AssetGroupPics>) => {
      return cell.row.original.isBudgetCodeDefault ? 'Yes' : 'No';
    },
  },
];

const DetailAccruedLastMonth: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const dataHook = useFetchAssetGroupDetail(id);

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={router.back}
      title="Detail Asset Group"
    >
      <Panel>
        {dataHook.isLoading && <Loader size="sm" />}

        <Row>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">Asset Group</h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.assetGroup}
            </h3>
          </Col>
          <Col lg={6}>
            <h4 className="profile-detail__info--title mb-1">
              Asset Group Code
            </h4>
            <h3 className="profile-detail__info--subtitle">
              {dataHook?.data?.assetGroupCode}
            </h3>
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={12} className="px-0">
            <h3 className="px-3">PIC HO</h3>
            <SimpleTable
              classTable="table-admin table-inherit"
              columns={columns}
              items={
                dataHook?.data?.pics.filter(
                  (data) => data.type == PicType.HO
                ) || []
              }
            />
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={12} className="px-0">
            <h3 className="px-3">PIC SITE</h3>
            <SimpleTable
              classTable="table-admin table-inherit"
              columns={columns}
              items={
                dataHook?.data?.pics.filter(
                  (data) => data.type == PicType.SITE
                ) || []
              }
            />
          </Col>
        </Row>

        <br />
        <Row>
          <Col lg={12}>
            <Link href={`/master-capex/asset-groups/${id}/edit`} passHref>
              <Button variant="primary" className="float-right">
                Edit
              </Button>
            </Link>
          </Col>
        </Row>
      </Panel>
    </DetailLayout>
  );
};

export default DetailAccruedLastMonth;
