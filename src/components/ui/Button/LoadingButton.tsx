import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

import Loader from '../Table/Loader';

interface LoadingButtonProps extends ButtonProps {
  className?: string;
  isLoading: Boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  className,
  isLoading,
  children,
  ...rest
}) => {
  return (
    <Button className={className} {...rest}>
      {!isLoading ? children : <Loader size="sm" />}
    </Button>
  );
};

export default LoadingButton;
