import { Row } from 'react-bootstrap';

const PanelBorder: React.FC = ({ children }) => {
  return <Row className="form-invoice__card mb-4">{children}</Row>;
};

export default PanelBorder;
