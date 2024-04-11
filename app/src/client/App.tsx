import { useAuth } from 'wasp/client/auth';
import { updateCurrentUser } from 'wasp/client/operations';
import './Main.css';
import AppNavBar from './components/AppNavBar';
import Footer from './components/Footer';
import { useMemo, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { data: user } = useAuth();

  const shouldDisplayAppNavBar = useMemo(() => {
    return location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';
  }, [location]);

  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith('/admin');
  }, [location]);

  useEffect(() => {
    if (user) {
      const lastSeenAt = new Date(user.lastActiveTimestamp);
      const today = new Date();
      if (today.getTime() - lastSeenAt.getTime() > 5 * 60 * 1000) {
        updateCurrentUser({ lastActiveTimestamp: today });
      }
    }
  }, [user]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <>
      <div className='bg-gradient-to-b from-airt-hero-gradient-start via-airt-hero-gradient-middle to-airt-secondary min-h-screen dark:text-white dark:bg-boxdark-2'>
        {isAdminDashboard ? (
          <>{children}</>
        ) : (
          <>
            {shouldDisplayAppNavBar && <AppNavBar />}
            <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>{children}</div>
            <Footer />
            <div className='flex items-center h-20 bg-airt-footer-copyrights'>
              <p className='text-center w-full text-sm text-airt-font-base opacity-50'>
                © 2024 airt. All rights reserved.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
