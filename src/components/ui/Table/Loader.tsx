import { Spinner } from 'react-bootstrap';

interface LoaderProps {
  size?: 'sm';
}

const Loader: React.FC<LoaderProps> = ({ size }) => {
  return (
    <div className="text-center">
      <Spinner
        variant="primary"
        animation="border"
        className="align-middle mr-2"
        size={size}
      />
      <strong className="ml-2">Loading...</strong>
    </div>
  );
};

export default Loader;
