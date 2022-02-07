import { useAtom } from 'jotai';
import { Col, Container, Row } from 'react-bootstrap';

import { sidebarState } from './Layout';

interface AppLayout {
  children: React.ReactNode;
  title?: string;
  controls?: React.ReactNode;
}

const ContentLayout: React.FC<AppLayout> = ({
  children,
  title = '',
  controls,
}: AppLayout) => {
  const [toggleSidebar] = useAtom(sidebarState);

  return (
    <section
      className={`bg-admin ${
        toggleSidebar ? '' : 'bg-admin__sidebar-inactive'
      }`}
    >
      <Container fluid>
        <Row>
          {title && (
            <Col lg={12} className="d-md-flex mt-40 mb-32 align-items-center">
              <h3 className="mb-3 mb-md-0 text__blue">{title}</h3>
              <div className="ml-auto d-flex flex-column flex-md-row pr-md-3 pr-lg-25">
                {controls}
              </div>
            </Col>
          )}
          {children}
        </Row>
      </Container>
    </section>
  );
};

export default ContentLayout;
