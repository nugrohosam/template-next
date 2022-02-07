import 'react-toastify/dist/ReactToastify.css';

import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';

import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

export const sidebarState = atom<boolean>(true);

const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const [toggleSidebar, setToggleSidebar] = useAtom(sidebarState);

  const checkingPage = useMemo<boolean>(() => {
    return router.pathname === '/auth';
  }, [router]);

  return (
    <div id="App">
      <div id="wrapper">
        {!checkingPage && (
          <Sidebar
            dataToggle={toggleSidebar}
            toggleSidebar={() => setToggleSidebar(!toggleSidebar)}
          />
        )}
        <div id="content" className={toggleSidebar ? '' : 'active'}>
          <Header
            dataToggle={toggleSidebar}
            toggleSidebar={() => setToggleSidebar(!toggleSidebar)}
          />
          {children}
          <Footer />
          <ToastContainer />
        </div>
      </div>
      <div className={`overlay ${toggleSidebar ? 'active' : ''}`}></div>
    </div>
  );
};

export default Layout;
