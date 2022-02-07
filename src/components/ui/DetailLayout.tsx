import { useAtom } from 'jotai';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';

import BreadCrumbs, { PathBreadcrumb } from './Breadcrumb';
import { sidebarState } from './Layout';

interface AppLayout {
  children: React.ReactNode;
  loading?: boolean;
  title: string;
  paths: PathBreadcrumb[];
  backButtonClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

const DetailLayout: React.FC<AppLayout> = ({
  children,
  loading,
  title,
  paths,
  backButtonClick,
}: AppLayout) => {
  const [toggleSidebar] = useAtom(sidebarState);

  return (
    <div>
      {!loading && (
        <section
          className={`bg-admin ${
            toggleSidebar ? '' : 'bg-admin__sidebar-inactive'
          }`}
        >
          <Container fluid>
            <Row>
              <Col lg={12} md={12} className="d-flex header-detail">
                <h3 className="text__blue text-uppercase d-flex">
                  <Image
                    src="/images/icons/left-arrow.svg"
                    className="header-detail__arrow"
                    alt="back button"
                    onClick={backButtonClick}
                    width={24}
                    height={19}
                  />
                  <div className="ml-3">{title}</div>
                </h3>
                <div className="ml-auto">
                  {paths?.length != 0 && <BreadCrumbs paths={paths} />}
                </div>
              </Col>

              {/* CONTENT */}
              <Col lg={12} md={12}>
                {children}
              </Col>
              {/* CONTENT */}
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default DetailLayout;
