import { Col } from 'react-bootstrap';

const PanelBorderTitle: React.FC = ({ children }) => {
  return (
    <Col lg={12} className="p-0 px-3 mb-2">
      <h5 className="text__blue text-uppercase">{children}</h5>
    </Col>
  );
};

export default PanelBorderTitle;
