import Image from 'next/image';
import { Nav, Navbar } from 'react-bootstrap';

import MessageDropdown from './MessageDropdown';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

const divContent = {
  display: 'contents',
};

interface NavbarProps {
  dataToggle: boolean;
  toggleSidebar: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Header: React.FC<NavbarProps> = ({
  dataToggle,
  toggleSidebar,
}: NavbarProps) => {
  return (
    <header className="header">
      <Navbar variant="light" expand="lg" className="flex-nowrap">
        <div style={divContent} className={dataToggle ? 'd-none' : ''}>
          <div className="mr-40 shrink-0">
            <div className="header__burger" onClick={toggleSidebar}>
              <Image
                src="/images/burger_nav.svg"
                width={20}
                height={20}
                alt="Burger"
              />
            </div>
          </div>
          <a>
            <Image
              src="/images/logo.png"
              className="logo img-fluid d-none d-lg-block"
              alt="Logo"
              height={45}
              width={195}
            />
          </a>
        </div>
        <Nav className="dropdown-user ml-auto d-flex flex-row mr-3 mr-lg-0">
          <NotificationDropdown />
          <ProfileDropdown />
        </Nav>
      </Navbar>
    </header>
  );
};

export default Header;
