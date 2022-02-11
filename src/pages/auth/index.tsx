import { fetchManagementMenu } from 'modules/menu/api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Auth() {
  const router = useRouter();

  useEffect(() => {
    if (router.query.token) {
      localStorage.setItem('token', router.query.token as string);
      fetchManagementMenu().then((response) => {
        localStorage.setItem('management', JSON.stringify(response));
        window.location.href = '/';
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <div className="loader-overlay" style={{ opacity: 1 }}>
      <div className="loader"></div>
    </div>
  );
}

export default Auth;
