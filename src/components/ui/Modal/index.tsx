import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ButtonVariant } from 'react-bootstrap/esm/types';

interface ModalBoxProps {
  buttonTitle: string;
  buttonVariant?: ButtonVariant;
  submitButtonVariant?: ButtonVariant;
  title: string;
  children?: React.ReactNode;
  classButton?: string;
  wordingSubmit?: string;
  dialogClassName?: string;
  onSend: () => void;
  onClikModal?: () => void;
}

const ModalBox: React.FC<ModalBoxProps> = ({
  title,
  children,
  buttonTitle,
  buttonVariant = 'green',
  submitButtonVariant = 'green',
  classButton,
  wordingSubmit,
  dialogClassName,
  onSend,
  onClikModal,
}) => {
  const [isShow, setIsShow] = useState(false);

  const toggleShow = () => setIsShow((isShow) => !isShow);

  const handleSubmit = () => {
    onSend();
    toggleShow();
  };

  const handleClickModal = () => {
    toggleShow();
    onClikModal && onClikModal();
  };
  return (
    <>
      <Button
        variant={buttonVariant}
        onClick={handleClickModal}
        className={classButton ? classButton : 'mr-lg-2 mb-3'}
      >
        {buttonTitle}
      </Button>
      <Modal
        show={isShow}
        onHide={toggleShow}
        centered
        dialogClassName={dialogClassName}
      >
        <Modal.Header className="pt-5">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{children}</Modal.Body>

        <Modal.Footer>
          <Button variant="orange" onClick={toggleShow}>
            Close
          </Button>
          <Button variant={submitButtonVariant} onClick={handleSubmit}>
            {wordingSubmit || 'Send'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalBox;
