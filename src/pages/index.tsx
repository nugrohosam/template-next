import ContentLayout from 'components/ui/ContentLayout';
import { ExampleData } from 'modules/dashboard/entities';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { Column } from 'react-table';

const Home: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState<Array<string>>([]);

  const columns: Column[] = useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        // eslint-disable-next-line react/display-name
        Cell: () => {
          return <Button>Edit</Button>;
        },
      },
    ],
    []
  );

  const data: ExampleData[] = useMemo(
    () => [
      {
        id: '2312-as123-sd12',
        firstName: 'Axel',
        lastName: 'Andrian',
      },
      {
        id: '1632-as124-sd15',
        firstName: 'Ami',
        lastName: 'Nemixe',
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Capex Frontend</title>
        <meta name="description" content="Development - Capex Frontend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContentLayout title="Dashboard">
        <Col lg={12}>
          Please Open <Link href="/sample">/sample</Link> to see the Sample
          page.
        </Col>
      </ContentLayout>
    </>
  );
};

export default Home;
