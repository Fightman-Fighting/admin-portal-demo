import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlatformProvider, usePlatform } from '@/contexts/PlatformContext';
import AuthScreen from '@/components/auth/AuthScreen';
import Portal from '@/components/Portal';
import { DEFAULT_PAGE, isPageAllowed, isPortalPath, pageToPath, pathToPage } from '@/lib/nav';

const Gate: React.FC = () => {
  const { currentUser } = usePlatform();
  const location = useLocation();
  const navigate = useNavigate();
  const page = pathToPage(location.pathname);

  useEffect(() => {
    if (!currentUser) {
      if (isPortalPath(location.pathname)) {
        navigate('/', { replace: true });
      }
      return;
    }

    if (location.pathname === '/') {
      navigate(pageToPath(DEFAULT_PAGE), { replace: true });
      return;
    }

    if (!isPageAllowed(currentUser.role, page)) {
      navigate(pageToPath(DEFAULT_PAGE), { replace: true });
    }
  }, [currentUser, location.pathname, navigate, page]);

  return currentUser ? <Portal /> : <AuthScreen />;
};

const AppLayout: React.FC = () => {
  return (
    <PlatformProvider>
      <Gate />
    </PlatformProvider>
  );
};

export default AppLayout;
