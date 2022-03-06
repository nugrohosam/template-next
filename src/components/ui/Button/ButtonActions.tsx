import Link from 'next/link';
import React from 'react';
import { Button } from 'react-bootstrap';
import { BsFillEyeFill, BsPencilSquare, BsTrash2Fill } from 'react-icons/bs';

interface ButtonActionsProps {
  hrefDetail?: string;
  hrefEdit?: string;
  disableEdit?: boolean;
  onDelete?: () => void;
  disableDelete?: boolean;
}

const ButtonActions: React.FC<ButtonActionsProps> = ({
  hrefDetail,
  hrefEdit,
  disableEdit = false,
  onDelete,
  disableDelete = false,
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
            <Button
              className="mr-2 d-flex"
              variant="info"
              disabled={disableEdit}
            >
              <BsPencilSquare className="align-self-center" />
            </Button>
          </Link>
        )}
        {onDelete && (
          <Button
            className="d-flex"
            variant="red"
            disabled={disableDelete}
            onClick={onDelete}
          >
            <BsTrash2Fill className="align-self-center" />
          </Button>
        )}
      </div>
    </>
  );
};

export default ButtonActions;
