import Panel from 'components/form/Panel';
import { PathBreadcrumb } from 'components/ui/Breadcrumb';
import DetailLayout from 'components/ui/DetailLayout';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from 'react-bootstrap';

const breadCrumb: PathBreadcrumb[] = [
  {
    label: 'Actual YTD',
    link: '/actual-ytd',
  },
  {
    label: 'Upload',
    active: true,
  },
];

const ActualYtdUpload: NextPage = () => {
  const router = useRouter();

  return (
    <DetailLayout
      paths={breadCrumb}
      backButtonClick={() => router.replace('actual-ytd')}
      title="Upload Actual YTD"
    >
      <Panel>
        <Form>
          <Row>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Year</FormLabel>
                <FormControl value={new Date().getFullYear()} disabled />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <FormLabel>Period</FormLabel>
                <FormControl value={new Date().getFullYear()} disabled />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <FormGroup>File</FormGroup>
              <FormControl value="Upload" disabled className="mb-3" />
              <Link href="#" passHref>
                Download Template
              </Link>
            </Col>
          </Row>
        </Form>
      </Panel>
    </DetailLayout>
  );
};

export default ActualYtdUpload;
