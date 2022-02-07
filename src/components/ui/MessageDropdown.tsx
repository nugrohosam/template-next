import Image from 'next/image';
import { Dropdown, Nav } from 'react-bootstrap';

const MessageDropdown: React.FC = () => {
  return (
    <Dropdown
      as={Nav.Item}
      className="d-flex pr-3 notification-admin"
      id="scroll-msg"
    >
      <Dropdown.Toggle as={Nav.Link}>
        <div className="position-relative padding-button">
          <Image
            src="/images/icons/ic_mail_blue.svg"
            width={20}
            height={17}
            alt="Message"
          />
          <span className="dot"></span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu align="right">
        <Dropdown.Header>Message</Dropdown.Header>
        <Dropdown.Item>
          <div className="notification-item">
            <span className="notification-text text-center">No Message</span>
          </div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MessageDropdown;
