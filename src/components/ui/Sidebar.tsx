import { useManagementMenu } from 'modules/custom/useManagementMenu';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { parseMenuToUrl } from 'utils/helpers';

interface SidebarProps {
  dataToggle: boolean;
  toggleSidebar: (event: React.MouseEvent<HTMLImageElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  dataToggle,
  toggleSidebar,
}: SidebarProps) => {
  const router = useRouter();
  const [menus] = useManagementMenu();
  const [toggleActive, setToggleActive] = useState<string | null>(null);

  return (
    <nav id="sidebar" className={`sidebar ${!dataToggle ? 'inactive' : ''}`}>
      <div className="sidebar__header d-flex">
        <Link href="/" passHref>
          <a>
            <Image
              src="/images/logo.png"
              width={195}
              height={45}
              className="sidebar__logo"
              alt="PAMA LOGO"
            />
          </a>
        </Link>
        <Image
          src="/images/cancel.svg"
          width={16}
          height={16}
          className="sidebar__dismiss cursor-pointer svg"
          alt="Cancel"
          onClick={toggleSidebar}
        />
      </div>
      <ul className="list-unstyled sidebar__components">
        <li>
          <Link href="/" passHref>
            <a
              href="javascript:void(0)"
              className={`text-capitalize ${
                router.pathname === '/' ? 'active' : ''
              }`}
            >
              Home
            </a>
          </Link>
        </li>
        {menus.map((menu, index) => {
          return (
            <li key={index}>
              {menu.items.length > 1 ||
              (menu.items.length === 1 &&
                menu.items[0].menu.toLowerCase() !==
                  menu.modul.toLowerCase()) ? (
                <Accordion>
                  <Accordion.Toggle
                    className="dropdown-toggle cursor-pointer position-relative text-capitalize"
                    aria-expanded={toggleActive == menu.modul}
                    onClick={() =>
                      setToggleActive((prevState: string | null) =>
                        prevState == menu.modul ? null : menu.modul
                      )
                    }
                    eventKey={menu.modul}
                  >
                    {menu.modul}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={menu.modul}>
                    <ul className="list-unstyled">
                      {menu.items.map((item, index_item) => {
                        return (
                          <li key={index_item}>
                            <Link href={parseMenuToUrl(item.menu)} passHref>
                              <a
                                href="javascript:void(0)"
                                className={`link-child text-capitalize ${
                                  router.pathname === parseMenuToUrl(item.menu)
                                    ? 'active'
                                    : ''
                                }`}
                              >
                                {item.menu}
                              </a>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Accordion.Collapse>
                </Accordion>
              ) : menu.items.length === 1 &&
                menu.items[0].menu.toLowerCase() ===
                  menu.modul.toLowerCase() ? (
                <Link href={parseMenuToUrl(menu.modul)} passHref>
                  <a
                    href="javascript:void(0)"
                    className={`text-capitalize ${
                      router.pathname === parseMenuToUrl(menu.modul)
                        ? 'active'
                        : ''
                    }`}
                  >
                    {menu.modul}
                  </a>
                </Link>
              ) : (
                <></>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
