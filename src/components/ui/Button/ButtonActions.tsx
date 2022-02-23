import Link from 'next/link';
import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

interface ButtonActionsProps {
  hrefDetail: string;
  hrefEdit: string;
  onDelete: () => void;
}

const ButtonActions: React.FC<ButtonActionsProps> = ({
  hrefDetail,
  hrefEdit,
  onDelete,
}) => {
  return (
    <>
      <div className="d-flex">
        <Link href={hrefDetail} passHref>
          <Button className="d-flex mr-2">
            <i className="bi-eye align-self-center"></i>
          </Button>
        </Link>
        <Link href={hrefEdit} passHref>
          <Button className="mr-2 d-flex" variant="info">
            <i className="bi-pencil-square align-self-center"></i>
          </Button>
        </Link>
        <Button className="d-flex" variant="red" onClick={onDelete}>
          <i className="bi-trash align-self-center"></i>
        </Button>
      </div>
    </>
  );
};

export default ButtonActions;
