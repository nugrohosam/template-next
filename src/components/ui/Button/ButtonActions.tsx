import Link from 'next/link';
import React from 'react';
import { Button } from 'react-bootstrap';
import { BsFillEyeFill, BsPencilSquare, BsTrash2Fill } from 'react-icons/bs';

interface ButtonActionsProps {
  hrefDetail?: string;
  hrefEdit?: string;
  onDelete?: () => void;
}

const ButtonActions: React.FC<ButtonActionsProps> = ({
  hrefDetail,
  hrefEdit,
  onDelete,
}) => {
  return (
    <>
      <div className="d-flex">
        {hrefDetail && (
          <Link href={hrefDetail} passHref>
            <Button className="d-flex mr-2">
              <BsFillEyeFill className="align-self-center" />
            </Button>
          </Link>
        )}
        {hrefEdit && (
          <Link href={hrefEdit} passHref>
            <Button className="mr-2 d-flex" variant="info">
              <BsPencilSquare className="align-self-center" />
            </Button>
          </Link>
        )}
        {onDelete && (
          <Button className="d-flex" variant="red" onClick={onDelete}>
            <BsTrash2Fill className="align-self-center" />
          </Button>
        )}
      </div>
    </>
  );
};

export default ButtonActions;
